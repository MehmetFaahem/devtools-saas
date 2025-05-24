-- PostgreSQL initialization script for DevTools SaaS
-- This script runs when the PostgreSQL container is first created

-- Create the main database (already created by POSTGRES_DB env var)
-- CREATE DATABASE devtools_saas;

-- Grant all privileges to the devtools user
GRANT ALL PRIVILEGES ON DATABASE devtools_saas TO devtools;

-- Connect to the devtools_saas database
\c devtools_saas;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO devtools;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO devtools;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO devtools;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO devtools;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO devtools;

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Log completion
\echo 'PostgreSQL initialization completed for DevTools SaaS'; 