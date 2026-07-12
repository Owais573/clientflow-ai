#!/bin/bash
# ==============================================================================
# ClientFlow AI — PostgreSQL Initialization Script
# ==============================================================================
# This script runs ONLY on first container start (when data volume is empty).
# It creates the separate 'n8n' database alongside the default 'clientflow' DB.
# ==============================================================================

set -e

echo ">>> Creating additional database: n8n"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE n8n
        WITH OWNER = '$POSTGRES_USER'
        ENCODING = 'UTF8'
        LC_COLLATE = 'en_US.utf8'
        LC_CTYPE = 'en_US.utf8'
        TEMPLATE = template0;
    
    GRANT ALL PRIVILEGES ON DATABASE n8n TO $POSTGRES_USER;
EOSQL

echo ">>> Database 'n8n' created successfully!"
echo ">>> Both 'clientflow' and 'n8n' databases are ready."
