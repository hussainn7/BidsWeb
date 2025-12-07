# Database Migration Guide

This guide explains how to migrate your local PostgreSQL database to Render's hosted PostgreSQL.

## Prerequisites

- PostgreSQL client tools installed (`pg_dump`, `psql`)
- Access to your local database
- Render PostgreSQL database URL

## Step 1: Create Database Dump

### Option A: Using the script (Recommended)

```bash
cd backend
chmod +x scripts/dump-database.sh
./scripts/dump-database.sh backup.sql
```

### Option B: Manual dump

```bash
cd backend

# Load environment variables
source .env  # or export them manually

# Create dump
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME \
    --clean \
    --if-exists \
    --no-owner \
    --no-acl \
    --format=plain \
    --file=backup.sql
```

This will create a `backup.sql` file in the `backend` directory.

## Step 2: Get Render Database URL

1. Go to your Render Dashboard
2. Navigate to your PostgreSQL database
3. Copy the **Internal Database URL** (or External if you're running locally)
   - Format: `postgresql://user:password@host:port/dbname`

## Step 3: Restore to Render Database

### Option A: Using the script (Recommended)

```bash
cd backend
chmod +x scripts/restore-database.sh
./scripts/restore-database.sh backup.sql "postgresql://user:pass@host:5432/dbname"
```

### Option B: Manual restore

```bash
# Using psql with DATABASE_URL
psql "postgresql://user:password@host:5432/dbname" < backup.sql

# Or using individual connection parameters
psql -h <render-host> -p 5432 -U <username> -d <dbname> < backup.sql
```

## Step 4: Verify Migration

Connect to your Render database and verify:

```bash
psql "postgresql://user:password@host:5432/dbname" -c "\dt"
```

You should see all your tables:
- users
- products
- orders
- clicks
- balance_transactions

## Troubleshooting

### SSL Connection Issues

If you get SSL errors, add `?sslmode=require` to your connection string:

```bash
psql "postgresql://user:password@host:5432/dbname?sslmode=require" < backup.sql
```

### Permission Issues

If you get permission errors, make sure:
- The database user has CREATE, INSERT, UPDATE, DELETE permissions
- You're using the correct database URL from Render

### Large Database

For large databases, you might want to use compressed format:

```bash
# Create compressed dump
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME \
    --clean \
    --if-exists \
    --no-owner \
    --no-acl \
    --format=custom \
    --file=backup.dump

# Restore compressed dump
pg_restore -d "postgresql://user:password@host:5432/dbname" backup.dump
```

## Alternative: Using Render CLI

If you have Render CLI installed:

```bash
# Export from local
pg_dump -h localhost -U postgres -d figma_replica > backup.sql

# Import to Render (using Render CLI)
render db:import <database-id> backup.sql
```

## Notes

- The `--clean` flag will drop existing objects before creating them
- The `--no-owner` and `--no-acl` flags ensure compatibility with Render's database user
- Always backup your Render database before importing if it has important data

