# DevTools SaaS Dashboard

A developer-centric dashboard that helps product teams manage SaaS onboarding, track performance metrics, and log application errors efficiently.

## Features

### Core Features Implemented

- **SaaS Onboarding Flow**: Tenant-aware setup for new dev teams or projects
- **Performance Metrics View**: Track API response times, request volumes with charts
- **Error Logging**: Capture frontend/backend error events with metadata
- **GitHub Integration**: Webhook support for issues and commits
- **OpenAI Integration**: Auto-generate summarized bug reports
- **Dual Database**: PostgreSQL for structured data, MongoDB for flexible logs

### Tech Stack

- **Frontend & Server**: Next.js 13 with App Router
- **API Layer**: tRPC with React Query
- **ORM**: Drizzle ORM
- **Databases**: PostgreSQL + MongoDB (hybrid logic)
- **AI**: OpenAI GPT-3.5 Turbo
- **UI**: Radix UI + Tailwind CSS + Recharts

## Prerequisites

- Node.js 18+
- PostgreSQL database
- MongoDB database
- OpenAI API key
- GitHub Personal Access Token (for integrations)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MehmetFaahem/devtools-saas.git
   cd devtools-saas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/devtools_saas"
   MONGODB_URI="mongodb://localhost:27017/devtools_saas_logs"

   # OpenAI Integration
   OPENAI_API_KEY="sk-your-openai-api-key-here"

   # GitHub Integration
   GITHUB_WEBHOOK_SECRET="your-github-webhook-secret"
   GITHUB_TOKEN="ghp_your-github-personal-access-token"

   # Next.js
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="http://localhost:3000"

   # App Configuration
   APP_URL="http://localhost:3000"
   WEBHOOK_URL="http://localhost:3000/api/webhooks/github"
   ```

4. **Set up databases**

   **PostgreSQL Setup:**

   ```bash
   # Generate database schema
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

   **MongoDB Setup:**

   - Ensure MongoDB is running locally or use MongoDB Atlas
   - Collections will be created automatically

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── trpc/                 # tRPC endpoints
│   │   └── webhooks/             # GitHub webhooks
│   ├── dashboard/                # Dashboard pages
│   │   ├── onboarding/           # App onboarding
│   │   ├── metrics/              # Performance metrics
│   │   ├── logs/                 # Error logs
│   │   ├── github/               # GitHub integration
│   │   └── settings/             # Settings
│   └── (marketing)/              # Marketing pages
├── lib/                          # Shared utilities
│   ├── db/                       # Database configurations
│   │   ├── postgres/             # PostgreSQL with Drizzle
│   │   └── mongodb/              # MongoDB connection
│   ├── trpc/                     # tRPC setup
│   │   ├── routers/              # API routers
│   │   ├── server.ts             # Server configuration
│   │   └── provider.tsx          # Client provider
│   ├── services/                 # External services
│   │   └── openai.ts             # OpenAI integration
│   ├── sdk/                      # Client SDKs
│   └── env.ts                    # Environment validation
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   ├── ui/                       # Reusable UI components
│   └── layout/                   # Layout components
└── drizzle.config.ts             # Drizzle ORM configuration
```

## API Endpoints

### tRPC Routes

- **Apps**: `/api/trpc/apps.*`

  - `getAll` - Get all apps for team
  - `create` - Create new app (onboarding)
  - `update` - Update app details
  - `regenerateApiKey` - Generate new API key

- **Logs**: `/api/trpc/logs.*`

  - `logError` - Log error (SDK endpoint)
  - `logPerformance` - Log performance data
  - `getErrorLogs` - Get error logs with filters
  - `resolveError` - Mark error as resolved

- **GitHub**: `/api/trpc/github.*`

  - `setupIntegration` - Configure GitHub integration
  - `getEvents` - Get GitHub events/issues
  - `getIssues` - Get GitHub issues

- **AI**: `/api/trpc/ai.*`
  - `generateBugReport` - Generate AI bug report
  - `analyzeErrorPatterns` - Analyze error patterns
  - `suggestResolution` - Get error resolution suggestions

### Webhooks

- **GitHub**: `/api/webhooks/github`
  - Receives GitHub webhook events
  - Stores events in MongoDB
  - Triggers AI processing

## SDK Usage

### JavaScript SDK

```javascript
import DevToolsSaaS from "@/lib/sdk/javascript";

// Initialize
const devtools = new DevToolsSaaS("your-api-key");

// Set up automatic error handling
devtools.setupErrorHandler();

// Log errors manually
devtools.logError({
  message: "Something went wrong",
  source: "frontend",
  severity: "error",
  metadata: { userId: "user123" },
});

// Log performance
devtools.logPerformance({
  endpoint: "/api/data",
  method: "GET",
  responseTime: 150,
  statusCode: 200,
});
```

## Database Schema

### PostgreSQL (Structured Data)

- `users` - User accounts
- `teams` - Organizations/teams
- `apps` - Applications being monitored
- `app_metrics` - Aggregated performance metrics
- `github_integrations` - GitHub integration settings
- `api_tokens` - API authentication tokens

### MongoDB (Flexible Data)

- `error_logs` - Error events with metadata
- `performance_logs` - Performance metrics
- `api_requests` - API request logs
- `github_events` - GitHub webhook events

## AI Features

### OpenAI Integration

- **Bug Report Generation**: Analyzes GitHub issues + error logs
- **Error Pattern Analysis**: Identifies common error patterns
- **Resolution Suggestions**: Provides fix recommendations
- **GitHub Event Processing**: Auto-summarizes commits and issues

## Authentication

Currently uses API key authentication for SDK integration. Web interface authentication can be added with NextAuth.js.

## Deployment

### Docker Deployment (Recommended)

The easiest way to deploy DevTools SaaS Dashboard is using Docker with all services containerized.

#### Quick Start with Docker

1. **Prerequisites**

   - Docker Desktop installed
   - Docker Compose installed

2. **Clone and Deploy**

   ```bash
   git clone https://github.com/MehmetFaahem/devtools-saas.git
   cd devtools-saas

   # For Linux/macOS
   chmod +x docker-deploy.sh
   ./docker-deploy.sh

   # For Windows PowerShell
   .\docker-deploy.ps1
   ```

3. **Manual Docker Setup**

   ```bash
   # Create .env file and update API keys
   cp .env.docker .env
   # Edit .env with your API keys

   # Build and start all services
   docker-compose up --build -d

   # Run database migrations
   docker-compose run --rm migrate
   ```

#### Docker Services

- **app**: Next.js application (Port 3000)
- **postgres**: PostgreSQL database (Port 5432)
- **mongodb**: MongoDB database (Port 27017)
- **redis**: Redis cache (Port 6379)

#### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Update and rebuild
docker-compose up --build -d

# Run migrations
docker-compose run --rm migrate

# Access database shell
docker-compose exec postgres psql -U devtools -d devtools_saas
docker-compose exec mongodb mongosh devtools_saas_logs
```

### Traditional Deployment

#### Environment Setup

1. Set up production databases (PostgreSQL + MongoDB)
2. Configure environment variables
3. Set up GitHub App for webhook integration
4. Deploy to Vercel/Railway/Docker

#### Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### Production Environment Variables

```env
# Required for Docker deployment
DATABASE_URL=postgresql://devtools:password@postgres:5432/devtools_saas
MONGODB_URI=mongodb://mongodb:27017/devtools_saas_logs

# Required API Keys (update these!)
OPENAI_API_KEY=sk-your-openai-api-key-here
GITHUB_TOKEN=ghp_your-github-personal-access-token
GITHUB_WEBHOOK_SECRET=your-secure-webhook-secret
NEXTAUTH_SECRET=your-secure-nextauth-secret-min-32-chars

# App Configuration
APP_URL=http://localhost:3000
WEBHOOK_URL=http://localhost:3000/api/webhooks/github
NEXTAUTH_URL=http://localhost:3000
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database schema
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

### Adding New Features

1. Create tRPC router in `lib/trpc/routers/`
2. Add to main router in `lib/trpc/root.ts`
3. Create UI components in `components/`
4. Add pages in `app/dashboard/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:

- Create an issue on GitHub
- Check the documentation
- Review the SDK examples
