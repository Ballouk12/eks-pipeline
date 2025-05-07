FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/gateway-service-0.1.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
