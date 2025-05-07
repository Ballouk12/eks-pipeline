#!/bin/bash
set -e

echo "Verifying deployment..."

# Déterminer l'environnement de déploiement et l'URL à vérifier
case "$DEPLOY_ENV" in
  "dev")
    BASE_URL="http://dev-excellia-app.votre-domaine.com"
    ;;
  "staging")
    BASE_URL="http://staging-excellia-app.votre-domaine.com"
    ;;
  "prod")
    BASE_URL="http://excellia-app.votre-domaine.com"
    ;;
  *)
    BASE_URL="http://localhost:8888"
    ;;
esac

# Vérifier si le gateway service est accessible
echo "Verifying Gateway Service..."
curl -f -s "$BASE_URL/actuator/health" > /dev/null || (echo "Gateway service check failed" && exit 1)

echo "Verification completed successfully"