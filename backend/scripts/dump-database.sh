#!/bin/bash

# Database dump script for migrating to Render PostgreSQL
# Usage: ./scripts/dump-database.sh [output_file]

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Set defaults
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_NAME=${DB_NAME:-figma_replica}
OUTPUT_FILE=${1:-backup.sql}

echo "Dumping database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Output file: $OUTPUT_FILE"
echo ""

# Create dump with schema and data
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME \
    --clean \
    --if-exists \
    --no-owner \
    --no-acl \
    --format=plain \
    --file=$OUTPUT_FILE

if [ $? -eq 0 ]; then
    echo "✅ Database dump created successfully: $OUTPUT_FILE"
    echo "File size: $(du -h $OUTPUT_FILE | cut -f1)"
else
    echo "❌ Error creating database dump"
    exit 1
fi

