# DevTools SaaS Dashboard - Docker Deployment Script (PowerShell)

Write-Host "🚀 DevTools SaaS Dashboard - Docker Deployment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    
    $envContent = @"
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
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "✅ .env file created. Please update the API keys and secrets." -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Update these values in .env file:" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY: Get from https://platform.openai.com/api-keys" -ForegroundColor Yellow
    Write-Host "   - GITHUB_TOKEN: Create from GitHub Settings > Developer settings > Personal access tokens" -ForegroundColor Yellow
    Write-Host "   - NEXTAUTH_SECRET: Generate a secure random string (min 32 characters)" -ForegroundColor Yellow
    Write-Host "   - GITHUB_WEBHOOK_SECRET: Set a secure secret for webhook validation" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after updating the .env file to continue"
}

Write-Host "🏗️  Building and starting services..." -ForegroundColor Cyan

# Build and start all services
docker-compose up --build -d

Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service health
Write-Host "🔍 Checking service health..." -ForegroundColor Cyan

# Check PostgreSQL
try {
    docker-compose exec postgres pg_isready -U devtools -d devtools_saas | Out-Null
    Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL is not ready" -ForegroundColor Red
}

# Check MongoDB
try {
    docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" | Out-Null
    Write-Host "✅ MongoDB is ready" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB is not ready" -ForegroundColor Red
}

# Run database migrations
Write-Host "📊 Running database migrations..." -ForegroundColor Cyan
docker-compose run --rm migrate

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🗄️  PostgreSQL is running on: localhost:5432" -ForegroundColor Cyan
Write-Host "🍃 MongoDB is running on: localhost:27017" -ForegroundColor Cyan
Write-Host "🔴 Redis is running on: localhost:6379" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
Write-Host "   - View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   - Stop services: docker-compose down" -ForegroundColor White
Write-Host "   - Restart services: docker-compose restart" -ForegroundColor White
Write-Host "   - Update and rebuild: docker-compose up --build -d" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more information, check the README.md file" -ForegroundColor Yellow 