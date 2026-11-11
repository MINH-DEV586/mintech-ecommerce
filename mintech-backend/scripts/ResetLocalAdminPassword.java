import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.DriverManager;
import java.util.Arrays;
import java.util.Properties;
import java.util.regex.Pattern;

import org.springframework.security.crypto.bcrypt.BCrypt;

class ResetLocalAdminPassword {
    private static final Pattern PASSWORD = Pattern.compile(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,72}");

    public static void main(String[] args) throws Exception {
        if (args.length != 2 || System.console() == null) {
            throw new IllegalArgumentException("Run from an interactive terminal with the config path and admin email.");
        }

        Properties config = new Properties();
        try (var reader = Files.newBufferedReader(Path.of(args[0]))) {
            config.load(reader);
        }
        String url = config.getProperty("spring.datasource.url", "");
        if (!url.matches("jdbc:mysql://localhost:3306/mintech_ecommerce(?:[?].*)?")) {
            throw new IllegalArgumentException("Expected the local Mintech MySQL database.");
        }

        var console = System.console();
        char[] password = console.readPassword("New password for %s: ", args[1]);
        char[] confirmation = console.readPassword("Confirm new password: ");
        String hash;
        try {
            if (password == null || !Arrays.equals(password, confirmation)) {
                throw new IllegalArgumentException("Passwords do not match.");
            }
            if (!PASSWORD.matcher(java.nio.CharBuffer.wrap(password)).matches()) {
                throw new IllegalArgumentException("Use 8-72 characters with uppercase, lowercase, a digit and one of @$!%*?&.");
            }
            hash = BCrypt.hashpw(new String(password), BCrypt.gensalt());
        } finally {
            if (password != null) {
                Arrays.fill(password, '\0');
            }
            if (confirmation != null) {
                Arrays.fill(confirmation, '\0');
            }
        }

        try (var connection = DriverManager.getConnection(url, config.getProperty("spring.datasource.username"),
                config.getProperty("spring.datasource.password"))) {
            connection.setAutoCommit(false);
            try (var update = connection.prepareStatement("""
                    UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE email = ? AND role = 'ADMIN' AND status = 'ACTIVE'
                    """)) {
                update.setString(1, hash);
                update.setString(2, args[1]);
                if (update.executeUpdate() != 1) {
                    connection.rollback();
                    throw new IllegalStateException("Expected exactly one active admin. No changes committed.");
                }
                connection.commit();
            }
        }
        System.out.println("Admin password updated.");
    }
}
