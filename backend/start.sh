#!/bin/sh
set -e

echo "🔄 Running database migrations..."
node dist/db/migrate.js

echo "🔄 Seeding database..."
node dist/db/seed-embeddings.js

echo "🚀 Starting application..."
exec node dist/index.js

