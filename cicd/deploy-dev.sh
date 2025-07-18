#!/bin/bash
echo "🚀 Deploying development..."
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
echo "✅ Dev running at http://localhost:3000"