import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

class MigrateLegacyIds {
    private static final List<String> TABLES = List.of(
            "addresses", "brands", "cart_items", "carts", "categories", "coupons",
            "order_items", "orders", "payments", "product_images", "product_specifications",
            "product_variants", "products", "reviews", "shipments", "users");
    private static final String NEXT = "_uuid_next_";
    private static final String BACKUP = "_uuid_backup_";

    private record Column(String name, String type, boolean nullable) {
        boolean numeric() {
            return type.equals("bigint");
        }
    }

    private record ForeignKey(String table, String column, String parent, String deleteRule, String updateRule) {}

    public static void main(String[] args) throws Exception {
        Properties config = new Properties();
        try (var reader = Files.newBufferedReader(Path.of(args[0]))) {
            config.load(reader);
        }
        String url = config.getProperty("spring.datasource.url");
        if (!url.startsWith("jdbc:mysql://localhost:3306/mintech_ecommerce?")) {
            throw new IllegalArgumentException("Expected the local Mintech database");
        }
        try (Connection db = DriverManager.getConnection(url, System.getenv("MINTECH_MIGRATION_USER"),
                System.getenv("MINTECH_MIGRATION_PASSWORD")); Statement sql = db.createStatement()) {
            migrate(sql);
        }
    }

    private static void migrate(Statement sql) throws Exception {
        Map<String, List<Column>> columns = new LinkedHashMap<>();
        for (String table : TABLES) {
            columns.put(table, new ArrayList<>());
        }
        try (var rows = sql.executeQuery("""
                SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, EXTRA
                FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()
                ORDER BY TABLE_NAME, ORDINAL_POSITION
                """)) {
            while (rows.next()) {
                String table = rows.getString(1);
                if (table.startsWith(NEXT) || table.startsWith(BACKUP)) {
                    throw new IllegalStateException("Migration tables already exist: " + table);
                }
                if (columns.containsKey(table)) {
                    if (rows.getString(5).matches(".*(VIRTUAL|STORED) GENERATED.*")) {
                        throw new IllegalStateException("Unexpected generated column in " + table);
                    }
                    columns.get(table).add(new Column(rows.getString(2), rows.getString(3), rows.getString(4).equals("YES")));
                }
            }
        }
        if (count(sql, "SELECT COUNT(*) FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE()") != 0
                || count(sql, "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND ENGINE = 'InnoDB'") != TABLES.size()) {
            throw new IllegalStateException("Unexpected tables or triggers in database");
        }
        List<ForeignKey> keys = new ArrayList<>();
        try (var rows = sql.executeQuery("""
                SELECT k.TABLE_NAME, k.COLUMN_NAME, k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME,
                       r.DELETE_RULE, r.UPDATE_RULE, k.ORDINAL_POSITION
                FROM information_schema.KEY_COLUMN_USAGE k
                JOIN information_schema.REFERENTIAL_CONSTRAINTS r
                  ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
                WHERE k.REFERENCED_TABLE_SCHEMA = DATABASE()
                ORDER BY k.TABLE_NAME, k.COLUMN_NAME
                """)) {
            while (rows.next()) {
                String table = rows.getString(1);
                String parent = rows.getString(3);
                if (!columns.containsKey(table) || !columns.containsKey(parent)
                        || !rows.getString(4).equals("id") || rows.getInt(7) != 1) {
                    throw new IllegalStateException("Unexpected foreign key on " + table);
                }
                keys.add(new ForeignKey(table, rows.getString(2), parent, rows.getString(5), rows.getString(6)));
            }
        }
        if (keys.size() != 18 || !columns.get("users").stream().anyMatch(c -> c.name().equals("id") && c.numeric())) {
            throw new IllegalStateException("Expected the legacy Mintech schema");
        }

        List<String> locks = new ArrayList<>();
        List<String> swaps = new ArrayList<>();
        for (var entry : columns.entrySet()) {
            String table = entry.getKey();
            String next = NEXT + table;
            if (entry.getValue().stream().noneMatch(c -> c.name().equals("id"))) {
                throw new IllegalStateException("Missing ID in " + table);
            }
            sql.executeUpdate("CREATE TABLE " + quote(next) + " LIKE " + quote(table));
            for (Column column : entry.getValue()) {
                if (isId(table, column, keys)) {
                    if (!column.numeric() && !column.type().equals("varchar")) {
                        throw new IllegalStateException("Unexpected ID type in " + table);
                    }
                    sql.executeUpdate("ALTER TABLE " + quote(next) + " MODIFY COLUMN " + quote(column.name())
                            + " VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin"
                            + (column.nullable() ? " NULL" : " NOT NULL"));
                }
            }
            locks.add(quote(table) + " WRITE");
            locks.add(quote(next) + " WRITE");
            locks.add(quote(next) + " AS " + quote("parent_check_" + table) + " WRITE");
            swaps.add(quote(table) + " TO " + quote(BACKUP + table));
            swaps.add(quote(next) + " TO " + quote(table));
        }

        int index = 0;
        for (ForeignKey key : keys) {
            sql.executeUpdate("ALTER TABLE " + quote(NEXT + key.table())
                    + " ADD CONSTRAINT " + quote("mintech_uuid_fk_" + ++index)
                    + " FOREIGN KEY (" + quote(key.column()) + ") REFERENCES " + quote(NEXT + key.parent())
                    + " (id) ON DELETE " + key.deleteRule() + " ON UPDATE " + key.updateRule());
        }

        sql.execute("SET SESSION lock_wait_timeout = 15");
        sql.execute("LOCK TABLES " + String.join(", ", locks));
        try {
            sql.execute("SET SESSION foreign_key_checks = 0");
            for (var entry : columns.entrySet()) {
                String table = entry.getKey();
                String next = NEXT + table;
                List<String> names = new ArrayList<>();
                List<String> values = new ArrayList<>();
                for (Column column : entry.getValue()) {
                    String name = quote(column.name());
                    names.add(name);
                    if (isId(table, column, keys) && column.numeric()) {
                        String hex = "LPAD(LOWER(HEX(" + name + ")), 16, '0')";
                        values.add("CONCAT('00000000-0000-0000-', LEFT(" + hex + ", 4), '-', RIGHT(" + hex + ", 12))");
                    } else {
                        if (isId(table, column, keys) && count(sql, "SELECT COUNT(*) FROM " + quote(table)
                                + " WHERE " + name + " IS NOT NULL AND (CHAR_LENGTH(" + name + ") <> 36 OR NOT IS_UUID(" + name + "))") != 0) {
                            throw new IllegalStateException("Invalid existing UUID in " + table + "." + column.name());
                        }
                        values.add(name);
                    }
                }
                sql.executeUpdate("INSERT INTO " + quote(next) + " (" + String.join(", ", names) + ") SELECT "
                        + String.join(", ", values) + " FROM " + quote(table));
                long rows = count(sql, "SELECT COUNT(*) FROM " + quote(table));
                if (rows != count(sql, "SELECT COUNT(*) FROM " + quote(next))) {
                    throw new IllegalStateException("Row count differs for " + table);
                }
                System.out.println(table + ": verified " + rows + " rows");
            }
            for (ForeignKey key : keys) {
                String child = quote(NEXT + key.table());
                String column = child + "." + quote(key.column());
                String parent = quote("parent_check_" + key.parent());
                if (count(sql, "SELECT COUNT(*) FROM " + child + " LEFT JOIN " + quote(NEXT + key.parent())
                        + " AS " + parent + " ON " + column + " = " + parent + ".id WHERE "
                        + column + " IS NOT NULL AND " + parent + ".id IS NULL") != 0) {
                    throw new IllegalStateException("Orphan rows for " + key.table() + "." + key.column());
                }
            }
            sql.execute("SET SESSION foreign_key_checks = 1");
            sql.executeUpdate("RENAME TABLE " + String.join(", ", swaps));
            System.out.println("UUID migration complete. Original tables are retained with prefix " + BACKUP);
        } finally {
            sql.execute("UNLOCK TABLES");
            sql.execute("SET SESSION foreign_key_checks = 1");
        }
    }

    private static boolean isId(String table, Column column, List<ForeignKey> keys) {
        return column.name().equals("id")
                || keys.stream().anyMatch(key -> key.table().equals(table) && key.column().equals(column.name()));
    }

    private static long count(Statement sql, String query) throws Exception {
        try (var rows = sql.executeQuery(query)) {
            rows.next();
            return rows.getLong(1);
        }
    }

    private static String quote(String name) {
        return Character.toString(96) + name.replace(Character.toString(96), Character.toString(96).repeat(2)) + Character.toString(96);
    }
}
