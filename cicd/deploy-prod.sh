#!/bin/bash
echo "🚀 Deploying production..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod down
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
echo "✅ Prod running at http://localhost"