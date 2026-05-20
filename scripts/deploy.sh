#!/usr/bin/env bash
set -euo pipefail

# Simple deploy helper to run on the target server.
# Usage: place this script on the server and run `./deploy.sh`

cd "$(dirname "$0")/.." || exit 1
if [ -f .env.production ]; then
  echo "Using .env.production for environment variables"
fi

echo "Pulling latest images and restarting compose stack..."
docker compose pull || true
docker compose up -d --remove-orphans
echo "Deploy complete"
