# syntax=docker/dockerfile:1
FROM eclipse-temurin:27-jdk-resolute AS build
WORKDIR /build
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN sed -i 's/\r$//' mvnw
COPY src/ src/
RUN --mount=type=cache,target=/root/.m2 sh mvnw -B -DskipTests package

FROM eclipse-temurin:27-jdk-resolute
WORKDIR /app
COPY --from=build /build/target/mintech-backend-*.jar app.jar
USER 10001:10001
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
