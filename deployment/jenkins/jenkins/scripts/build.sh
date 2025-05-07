#!/bin/bash
set -e

echo "Building Docker images..."
docker-compose build

echo "Build completed successfully"