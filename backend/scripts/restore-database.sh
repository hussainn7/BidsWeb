#!/bin/bash

# Database restore script for Render PostgreSQL
# Usage: ./scripts/restore-database.sh [input_file] [render_db_url]

# Check if input file is provided
if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-database.sh <backup.sql> <DATABASE_URL>"
    echo ""
    echo "Example:"
    echo "  ./scripts/restore-database.sh backup.sql postgresql://user:pass@host:5432/dbname"
    exit 1
fi

INPUT_FILE=$1
DATABASE_URL=$2

if [ -z "$DATABASE_URL" ]; then
    echo "Please provide the Render PostgreSQL DATABASE_URL"
    echo "You can find it in Render Dashboard > Your Database > Internal Database URL"
    echo ""
    read -p "Enter DATABASE_URL: " DATABASE_URL
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: File $INPUT_FILE not found"
    exit 1
fi

echo "Restoring database from: $INPUT_FILE"
echo "Target: $DATABASE_URL"
echo ""
echo "⚠️  This will overwrite the target database. Continue? (y/N)"
read -r response
if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Restore database
psql "$DATABASE_URL" < "$INPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
else
    echo "❌ Error restoring database"
    exit 1
fi

