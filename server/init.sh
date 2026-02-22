#!/bin/sh
set -e

echo "Running database migrations..."
node dist/db/migrate.js

echo "Starting server..."
node dist/server.js
