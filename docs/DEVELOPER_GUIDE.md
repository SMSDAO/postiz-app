# AI Poster Application - Developer Documentation

## Architecture Overview

AI Poster is built using a modern, scalable architecture:

### Technology Stack

- **Frontend**: Next.js 15.2.3 (React 18.3) - All CVEs patched
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL (with Supabase/NEON support)
- **Cache**: Redis
- **Queue**: BullMQ
- **Monorepo**: Nx Workspace

### Application Structure

```
postiz-app/
├── apps/
│   ├── ai-poster-user/      # User Dashboard (Port 4300)
│   ├── ai-poster-admin/     # Admin Dashboard (Port 4301)
│   ├── ai-poster-dev/       # Developer Dashboard (Port 4302)
│   ├── frontend/            # Main Frontend
│   ├── backend/             # API Server
│   ├── workers/             # Background Jobs
│   └── cron/                # Scheduled Tasks
├── libraries/
│   ├── helpers/
│   │   ├── auto-healing/    # Auto-healing services
│   │   ├── auto-config/     # Auto-configuration
│   │   └── database.config.ts
│   └── nestjs-libraries/
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20.17.0
- PostgreSQL 12+
- Redis 7+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/SMSDAO/postiz-app.git
cd postiz-app

# Install dependencies
npm install

# Set up environment variables
cp .env.ai-poster.example .env

# Configure database
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma-generate

# Run database migrations
npm run prisma-db-push

# Start development servers
npm run dev
```

### Running Individual Dashboards

```bash
# User Dashboard (Port 4300)
cd apps/ai-poster-user && npm run dev

# Admin Dashboard (Port 4301)
cd apps/ai-poster-admin && npm run dev

# Developer Dashboard (Port 4302)
cd apps/ai-poster-dev && npm run dev
```

## Database Configuration

### Supported Providers

1. **PostgreSQL** (Standard)
2. **Supabase** (Cloud PostgreSQL with auth)
3. **NEON** (Serverless PostgreSQL)

### Configuration

```typescript
// Auto-detection from connection string
import { getDatabaseConfig } from '@gitroom/helpers/database.config';

const config = getDatabaseConfig();
// Returns appropriate config based on provider
```

### Connection Pooling

For serverless deployments:

```typescript
import { getPooledConnectionString } from '@gitroom/helpers/database.config';

const pooledUrl = getPooledConnectionString(process.env.DATABASE_URL);
```

## Auto-Healing Service

### Overview

The auto-healing service monitors system health and automatically recovers from failures.

### Usage

```typescript
import { AutoHealingService } from '@gitroom/helpers/auto-healing/auto-healing.service';

// Initialize service
const healingService = new AutoHealingService({
  checkInterval: 60000,    // 1 minute
  retryAttempts: 3,
  retryDelay: 5000         // 5 seconds
});

// Register custom health check
healingService.registerHealthCheck('my-service', async () => {
  // Your health check logic
  return {
    healthy: true,
    message: 'Service is running',
    responseTime: 150
  };
});

// Register healing action
healingService.registerHealingAction({
  name: 'restart-my-service',
  description: 'Restart my service',
  priority: 10,
  execute: async () => {
    // Your healing logic
    return true; // Return true if successful
  }
});

// Start monitoring
await healingService.startMonitoring();

// Get health status
const status = healingService.getHealthStatus();
console.log(status.overall); // 'healthy', 'degraded', or 'unhealthy'
```

### Built-in Health Checks

- **Database**: Validates database connection
- **Redis**: Checks Redis connectivity
- **API**: Monitors API response times

## Auto-Configuration Service

### Overview

Automatically detects and configures application settings.

### Usage

```typescript
import { AutoConfigService, runAutoConfigCheck } from '@gitroom/helpers/auto-config/auto-config.service';

// Run configuration check
const result = await runAutoConfigCheck();

if (!result.valid) {
  console.error('Configuration errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Configuration warnings:', result.warnings);
}

// Use service directly
const configService = new AutoConfigService();

// Get configuration value
const dbUrl = configService.get('DATABASE_URL');

// Set configuration value
configService.set('MY_CONFIG', 'value', 'user');

// Auto-detect configurations
const detection = await configService.autoDetect();
console.log('Detected:', detection.detected);
console.log('Suggestions:', detection.suggestions);

// Auto-configure missing settings
const config = await configService.autoConfigure();
console.log('Configured:', config.configured);

// Export to .env format
const envContent = configService.exportToEnv();
```

## API Development

### Creating New Endpoints

```typescript
// In apps/backend/src/controllers/

import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api/ai-poster')
export class AIPosterController {
  
  @Get('health')
  async getHealth() {
    return { status: 'healthy' };
  }

  @Post('generate')
  async generatePost(@Body() data: any) {
    // AI post generation logic
    return { post: 'Generated content' };
  }
}
```

### Adding Services

```typescript
// In apps/backend/src/services/

import { Injectable } from '@nestjs/common';

@Injectable()
export class AIPosterService {
  async generatePost(prompt: string) {
    // Business logic here
    return { content: 'Generated post' };
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ai-poster.service.spec.ts

# Run with coverage
npm test -- --coverage
```

### Writing Tests

```typescript
import { Test } from '@nestjs/testing';
import { AIPosterService } from './ai-poster.service';

describe('AIPosterService', () => {
  let service: AIPosterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AIPosterService],
    }).compile();

    service = module.get<AIPosterService>(AIPosterService);
  });

  it('should generate a post', async () => {
    const result = await service.generatePost('test prompt');
    expect(result).toBeDefined();
    expect(result.content).toBeTruthy();
  });
});
```

## Deployment

### Vercel Deployment

The project is pre-configured for Vercel deployment.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Configure in Vercel dashboard or `.env.production`:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Authentication secret
- `OPENAI_API_KEY`: For AI features
- `NEXT_PUBLIC_BACKEND_URL`: API endpoint

### Docker Deployment

```bash
# Build Docker image
docker build -t ai-poster .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  ai-poster
```

## Security Best Practices

### Authentication

- Use JWT tokens for authentication
- Implement refresh token rotation
- Set secure HTTP-only cookies
- Enable CORS with whitelist

### API Security

- Rate limiting (100 requests per 15 min)
- Input validation with class-validator
- SQL injection prevention via Prisma
- XSS protection headers

### Data Protection

- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement RBAC (Role-Based Access Control)
- Regular security audits

## Contributing

### Code Style

- Follow existing code patterns
- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Write tests for new features

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Run tests and linting
5. Submit pull request

### Commit Convention

```
feat: Add new AI generation endpoint
fix: Resolve database connection issue
docs: Update API documentation
test: Add tests for auto-healing service
```

## API Reference

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

### AI Poster Endpoints

```
POST /api/ai-poster/generate
GET  /api/ai-poster/posts
POST /api/ai-poster/schedule
DELETE /api/ai-poster/posts/:id
```

### Health & Monitoring

```
GET /api/health
GET /api/health/database
GET /api/health/redis
GET /api/metrics
```

## Troubleshooting

### Database Connection Issues

```typescript
import { testDatabaseConnection, getDatabaseConfig } from '@gitroom/helpers/database.config';

const config = getDatabaseConfig();
const result = await testDatabaseConnection(config);

if (!result.success) {
  console.error('Database error:', result.error);
}
```

### Redis Connection Issues

Check Redis connectivity:

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Build Errors

```bash
# Clean build artifacts
rm -rf dist .next node_modules

# Reinstall dependencies
npm install

# Regenerate Prisma client
npm run prisma-generate

# Rebuild
npm run build
```

## Support

### Getting Help

- Documentation: `/docs`
- GitHub Issues: Report bugs and request features
- Discord: Join developer community
- Email: dev-support@ai-poster.app

### Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Nx Documentation](https://nx.dev)

---

**Version**: 1.0.0  
**Last Updated**: February 2026
