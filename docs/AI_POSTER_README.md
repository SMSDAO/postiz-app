# AI Poster Application 🚀

A full-featured, production-ready application scaffold for AI-powered social media content creation and management.

## Features

✨ **Three Complete Dashboards**
- 👤 User Dashboard - Content creation and scheduling
- 🛡️ Admin Dashboard - System management and monitoring  
- 👨‍💻 Developer Dashboard - API management and documentation

🤖 **AI-Powered Content Generation**
- Intelligent post generation using OpenAI
- Multi-platform optimization
- Hashtag and mention suggestions

🔧 **Auto-Healing & Auto-Configuration**
- Automatic system health monitoring
- Self-healing capabilities for common failures
- Intelligent configuration detection

🗄️ **Multi-Database Support**
- PostgreSQL (standard)
- Supabase (with built-in auth)
- NEON (serverless)
- Automatic connection pooling

☁️ **Production-Ready Deployment**
- Pre-configured for Vercel
- Preview deployment support
- Docker containerization
- Environment-based configuration

🔒 **Security-First**
- Built-in security headers
- Rate limiting
- Input validation
- CORS protection

📊 **Monitoring & Analytics**
- Health check endpoints
- Performance monitoring
- Error tracking
- Usage analytics

## Quick Start

### Prerequisites

- Node.js 20.17.0+
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

# Copy environment template
cp .env.ai-poster.example .env

# Configure your environment variables
# Edit .env with your database and API keys

# Generate Prisma client
npm run prisma-generate

# Initialize database
npm run prisma-db-push

# Start all services
npm run dev
```

### Access Dashboards

Once running, access the dashboards at:

- **User Dashboard**: http://localhost:4300
- **Admin Dashboard**: http://localhost:4301
- **Developer Dashboard**: http://localhost:4302
- **Main Application**: http://localhost:4200
- **API Server**: http://localhost:3000

## Project Structure

```
postiz-app/
├── apps/
│   ├── ai-poster-user/      # User Dashboard
│   ├── ai-poster-admin/     # Admin Dashboard
│   ├── ai-poster-dev/       # Developer Dashboard
│   ├── frontend/            # Main Application
│   ├── backend/             # API Server
│   ├── workers/             # Background Jobs
│   └── cron/                # Scheduled Tasks
├── libraries/
│   ├── helpers/
│   │   ├── auto-healing/    # Auto-healing services
│   │   ├── auto-config/     # Auto-configuration
│   │   └── database.config.ts
│   └── nestjs-libraries/    # Shared NestJS modules
├── docs/                    # Documentation
│   ├── USER_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   └── VERCEL_DEPLOYMENT.md
└── vercel.json             # Vercel configuration
```

## Technology Stack

### Frontend
- **Next.js 15.0.8**: React framework with App Router (Security patched)
- **React 18.3**: UI library
- **Tailwind CSS**: Utility-first CSS
- **TypeScript**: Type safety

### Backend
- **NestJS**: Node.js framework
- **Prisma**: Database ORM
- **BullMQ**: Job queue
- **Redis**: Caching and queue

### Database
- **PostgreSQL**: Primary database
- **Supabase/NEON**: Cloud options
- **Connection Pooling**: For serverless

### AI & ML
- **OpenAI GPT-4**: Content generation
- **LangChain**: AI orchestration
- **CopilotKit**: AI integration

## Configuration

### Database Setup

#### Supabase
```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

#### NEON
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

#### Standard PostgreSQL
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

### Redis Setup

```bash
# Local Redis
REDIS_URL=redis://localhost:6379

# Upstash (for Vercel)
REDIS_URL=rediss://default:password@region.upstash.io:6379
```

### AI Configuration

```bash
OPENAI_API_KEY=sk-...
AI_POSTER_MODEL=gpt-4
AI_POSTER_MAX_TOKENS=2000
```

## Auto-Healing

The application includes built-in auto-healing:

```typescript
import { AutoHealingService } from '@/libraries/helpers/src/auto-healing/auto-healing.service';

const healingService = new AutoHealingService();
await healingService.startMonitoring();
```

Features:
- Automatic database reconnection
- Redis connection recovery
- Service health monitoring
- Configurable retry logic

## Auto-Configuration

Intelligent configuration detection:

```typescript
import { runAutoConfigCheck } from '@/libraries/helpers/src/auto-config/auto-config.service';

const result = await runAutoConfigCheck();
// Detects database provider, environment, and more
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

See [VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed instructions.

### Docker

```bash
# Build image
docker build -t ai-poster .

# Run container
docker run -p 3000:3000 ai-poster
```

### Traditional Hosting

```bash
# Build all applications
npm run build

# Start in production
npm run start:prod
```

## Development

### Running Services Individually

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Workers only
npm run dev:workers

# Cron jobs only
npm run dev:cron
```

### Database Migrations

```bash
# Generate Prisma client
npm run prisma-generate

# Push schema changes
npm run prisma-db-push

# Reset database (WARNING: destructive)
npm run prisma-reset
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- my-test.spec.ts
```

### Linting

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## API Endpoints

### Health Checks
```
GET  /api/health
GET  /api/health/database
GET  /api/health/redis
```

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### AI Poster
```
POST /api/ai-poster/generate
GET  /api/ai-poster/posts
POST /api/ai-poster/schedule
DELETE /api/ai-poster/posts/:id
```

## Documentation

- **[User Guide](docs/USER_GUIDE.md)**: End-user documentation
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)**: Technical documentation
- **[Deployment Guide](docs/VERCEL_DEPLOYMENT.md)**: Vercel deployment instructions

## Security

### Built-in Security Features

- 🔒 Security headers (X-Frame-Options, CSP, etc.)
- 🚫 Rate limiting (100 req/15min)
- ✅ Input validation
- 🛡️ CORS protection
- 🔐 JWT authentication
- 📝 Audit logging

### Security Best Practices

1. Use environment variables for secrets
2. Enable HTTPS in production
3. Regular dependency updates
4. Security audit with `npm audit`
5. Implement 2FA for admin access

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

### Getting Help

- 📚 [Documentation](docs/)
- 💬 [Discord Community](https://discord.postiz.com)
- 🐛 [Issue Tracker](https://github.com/SMSDAO/postiz-app/issues)
- 📧 Email: support@ai-poster.app

### Useful Links

- [Postiz Main Site](https://postiz.com)
- [Full Documentation](https://docs.postiz.com)
- [API Reference](https://docs.postiz.com/api)

## Acknowledgments

Built on top of [Postiz](https://postiz.com) - the open-source social media scheduling platform.

Special thanks to all contributors and the open-source community.

## Roadmap

- [ ] Enhanced AI models (GPT-4 Turbo, Claude)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile applications (iOS/Android)
- [ ] Plugin marketplace
- [ ] White-label solutions
- [ ] Team collaboration features
- [ ] Advanced automation rules

## Stats

- ⚡ Built with modern tech stack
- 🎯 Production-ready out of the box
- 📦 Monorepo architecture with Nx
- 🔄 Auto-healing and auto-configuration
- 🚀 Optimized for Vercel deployment
- 📊 Comprehensive monitoring
- 🔒 Security-first approach
- 📖 Well-documented

---

**Made with ❤️ by the AI Poster Team**

Star ⭐ this repo if you find it helpful!
