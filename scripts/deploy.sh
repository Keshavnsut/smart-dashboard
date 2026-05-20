#!/usr/bin/env bash
set -euo pipefail

# Simple deploy helper to run on the target server.
# Usage: place this script on the server and run `./deploy.sh`

cd "$(dirname "$0")/.." || exit 1

compose=(docker compose)
if [ -f docker-compose.prod.yml ]; then
  compose=(docker compose -f docker-compose.prod.yml)
fi

if [ -f .env ]; then
  echo "Using .env for environment variables"
fi

echo "Pulling latest images and restarting compose stack..."
"${compose[@]}" pull || true
"${compose[@]}" up -d --remove-orphans --build
echo "Deploy complete"
