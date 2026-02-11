# AI Poster - Vercel Deployment Guide

## Overview

This guide walks you through deploying the AI Poster application to Vercel with preview capabilities.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository connected to Vercel
- PostgreSQL database (Supabase, NEON, or other)
- Redis instance (Upstash recommended for serverless)

## Quick Deploy

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SMSDAO/postiz-app)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
# From project root
vercel

# For production
vercel --prod
```

## Environment Configuration

### Required Environment Variables

Configure these in your Vercel project settings:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://default:password@host:6379

# Authentication
JWT_SECRET=your-long-random-secret-string-at-least-32-chars

# Application URLs
FRONTEND_URL=https://your-app.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-app.vercel.app
BACKEND_INTERNAL_URL=https://your-app.vercel.app

# AI Features (Optional)
OPENAI_API_KEY=sk-...

# Storage (Optional - for media uploads)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_BUCKETNAME=your-bucket
CLOUDFLARE_BUCKET_URL=https://your-bucket.r2.cloudflarestorage.com/
```

### Setting Environment Variables

#### Via Vercel Dashboard

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development environments

#### Via Vercel CLI

```bash
# Add environment variable
vercel env add DATABASE_URL

# Pull environment variables locally
vercel env pull .env.local
```

## Database Setup

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your connection string

2. **Configure Connection**

```bash
# Connection string format
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

# Also set these
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Run Migrations**

```bash
# Locally first
npm run prisma-db-push

# Or use Supabase SQL editor
# Copy migrations from libraries/nestjs-libraries/src/database/prisma/migrations
```

### Option 2: NEON

1. **Create NEON Project**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Copy your connection string

2. **Configure Connection**

```bash
# NEON connection string (with pooling)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

### Option 3: Other PostgreSQL

Any PostgreSQL provider works:
- Railway
- Render
- DigitalOcean
- AWS RDS
- Google Cloud SQL

## Redis Setup

### Option 1: Upstash (Recommended for Vercel)

1. **Create Upstash Database**
   - Go to [upstash.com](https://upstash.com)
   - Create a new Redis database
   - Choose a region close to your Vercel deployment

2. **Configure Connection**

```bash
REDIS_URL=rediss://default:your-password@region.upstash.io:6379
```

### Option 2: Redis Cloud

```bash
REDIS_URL=redis://default:password@redis-xxxxx.cloud.redislabs.com:12345
```

## Deployment Configuration

### vercel.json

The project includes a pre-configured `vercel.json`:

```json
{
  "version": 2,
  "name": "postiz-ai-poster",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm ci && npm run prisma-generate",
  "regions": ["iad1"]
}
```

### Build Settings

Vercel automatically detects Next.js projects. Override if needed:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/apps/frontend/.next",
  "installCommand": "npm ci && npm run prisma-generate"
}
```

## Preview Deployments

### Automatic Previews

Every push to a branch creates a preview deployment:

1. Push to feature branch
2. Vercel automatically deploys
3. Preview URL: `https://branch-name-project.vercel.app`
4. Comment appears in PR with preview link

### Preview Environment Variables

Set preview-specific variables:

```bash
# Via CLI
vercel env add MY_VAR preview

# Via Dashboard
# Environment Variables → Select "Preview" scope
```

### Testing Preview Deployments

```bash
# Deploy current branch to preview
vercel

# Get preview URL
vercel inspect [deployment-id]
```

## Production Deployment

### Deploy to Production

```bash
# Via CLI
vercel --prod

# Via Git
# Push to main branch
git push origin main
```

### Production Checklist

- [ ] All environment variables configured
- [ ] Database migrated
- [ ] Redis connected
- [ ] DNS configured (if custom domain)
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Monitoring enabled

### Custom Domain

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Configure DNS**

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Monitoring & Maintenance

### Health Checks

Monitor application health:

```bash
# Check deployment health
curl https://your-app.vercel.app/api/health

# Check database
curl https://your-app.vercel.app/api/health/database

# Check Redis
curl https://your-app.vercel.app/api/health/redis
```

### Logs

View logs in Vercel dashboard or via CLI:

```bash
# View runtime logs
vercel logs [deployment-url]

# Stream logs
vercel logs --follow
```

### Analytics

Vercel provides built-in analytics:
- Page views
- Top pages
- Performance metrics
- Error tracking

Enable in: Project Settings → Analytics

## Troubleshooting

### Build Failures

**Issue**: Build fails during deployment

**Solutions**:

1. Check build logs in Vercel dashboard
2. Verify all dependencies are in package.json
3. Ensure Node.js version matches (20.17.0)
4. Clear Vercel build cache

```bash
# Clear cache
vercel --force
```

### Database Connection Issues

**Issue**: Cannot connect to database

**Solutions**:

1. Verify DATABASE_URL is correct
2. Check database allows connections from Vercel IPs
3. Use connection pooling for serverless
4. Verify SSL settings

```bash
# Test connection locally
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('Connected')).catch(e => console.error(e));"
```

### Redis Connection Issues

**Issue**: Redis connection timeouts

**Solutions**:

1. Verify REDIS_URL is correct
2. Check Redis allows external connections
3. Use TLS connection (rediss://)
4. Verify firewall rules

### Environment Variables Not Loading

**Issue**: Environment variables undefined at runtime

**Solutions**:

1. Redeploy after adding variables
2. Ensure variables are set for correct environment (Preview/Production)
3. Check variable names (no typos)
4. For client-side variables, use NEXT_PUBLIC_ prefix

### Function Timeouts

**Issue**: Serverless functions timing out

**Solutions**:

1. Optimize database queries
2. Use connection pooling
3. Implement caching
4. Consider upgrading Vercel plan for longer timeouts

## Advanced Configuration

### Custom Build Output

```json
{
  "builds": [
    {
      "src": "apps/frontend/package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### Rewrites for API Routes

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### Security Headers

Already configured in vercel.json:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Cron Jobs (Vercel Pro)

For scheduled tasks:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## CI/CD Integration

### GitHub Actions

The repository includes GitHub Actions workflows for CI/CD:

```yaml
name: Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
```

For Vercel deployment integration, you can add the `amondnet/vercel-action` to your workflow. See the [Vercel Action documentation](https://github.com/amondnet/vercel-action) for details.

## Cost Optimization

### Tips to Reduce Costs

1. **Use Connection Pooling**: Reduces database connections
2. **Implement Caching**: Use Redis for frequent queries
3. **Optimize Images**: Use Next.js Image optimization
4. **Edge Functions**: Use for static content
5. **Monitor Usage**: Review Vercel analytics

### Free Tier Limits

- 100GB bandwidth
- 100 deployments per day
- Serverless function execution time

## Support

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

### Getting Help

- Vercel Support: support@vercel.com
- Community: [GitHub Discussions](https://github.com/vercel/vercel/discussions)
- AI Poster Support: support@ai-poster.app

---

**Version**: 1.0.0  
**Last Updated**: February 2026
