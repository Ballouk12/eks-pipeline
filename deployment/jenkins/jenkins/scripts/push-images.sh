#!/bin/bash
set -e

echo "Logging into Docker registry..."
echo "$DOCKER_REGISTRY_CREDENTIALS_PSW" | docker login -u "$DOCKER_REGISTRY_CREDENTIALS_USR" --password-stdin

echo "Pushing Docker images..."
docker-compose push

echo "All images pushed successfully"