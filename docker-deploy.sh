#!/bin/bash

# DevTools SaaS Dashboard - Docker Deployment Script

echo "🚀 DevTools SaaS Dashboard - Docker Deployment"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cat > .env << 'EOF'
# Environment variables for Docker deployment
# Update these values for your deployment

# Database Configuration (automatically configured for Docker)
DATABASE_URL=postgresql://devtools:password@postgres:5432/devtools_saas
MONGODB_URI=mongodb://mongodb:27017/devtools_saas_logs

# OpenAI Integration (REQUIRED - Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here

# GitHub Integration (REQUIRED for GitHub features)
GITHUB_WEBHOOK_SECRET=your-github-webhook-secret-change-in-production
GITHUB_TOKEN=ghp_your-github-personal-access-token

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-change-in-production-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# App Configuration
APP_URL=http://localhost:3000
WEBHOOK_URL=http://localhost:3000/api/webhooks/github

# Production Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF
    echo "✅ .env file created. Please update the API keys and secrets."
    echo ""
    echo "⚠️  IMPORTANT: Update these values in .env file:"
    echo "   - OPENAI_API_KEY: Get from https://platform.openai.com/api-keys"
    echo "   - GITHUB_TOKEN: Create from GitHub Settings > Developer settings > Personal access tokens"
    echo "   - NEXTAUTH_SECRET: Generate a secure random string (min 32 characters)"
    echo "   - GITHUB_WEBHOOK_SECRET: Set a secure secret for webhook validation"
    echo ""
    read -p "Press Enter after updating the .env file to continue..."
fi

echo "🏗️  Building and starting services..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose exec postgres pg_isready -U devtools -d devtools_saas > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check MongoDB
if docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is ready"
else
    echo "❌ MongoDB is not ready"
fi

# Run database migrations
echo "📊 Running database migrations..."
docker-compose run --rm migrate

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo "🗄️  PostgreSQL is running on: localhost:5432"
echo "🍃 MongoDB is running on: localhost:27017"
echo "🔴 Redis is running on: localhost:6379"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo "   - Update and rebuild: docker-compose up --build -d"
echo ""
echo "📖 For more information, check the README.md file" 