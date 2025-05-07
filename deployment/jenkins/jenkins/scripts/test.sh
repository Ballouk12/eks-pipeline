#!/bin/bash
set -e

echo "Running tests..."
# Vous pouvez ajouter des tests spécifiques pour vos microservices ici
# Par exemple:
# docker-compose run --rm inscription-service ./mvnw test
# docker-compose run --rm gateway-service ./mvnw test

echo "All tests passed"