# Step 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Typo fixed: mvc ki jagah mvn kiya hai
RUN mvn clean package -DskipTests

# Step 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Isme jar file ke sath-sath war file ko bhi handle karne ke liye wildcard use kiya hai
COPY --from=build /app/target/*.[jw]ar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
