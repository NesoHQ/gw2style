# GW2STYLE Backend - Configuration & Setup Guide

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Database Setup](#database-setup)
- [Discord Bot Configuration](#discord-bot-configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Go** | 1.25+ | Backend runtime |
| **PostgreSQL** | 14+ | Database |
| **Make** | Any | Build automation |
| **Git** | Any | Version control |

### Optional Tools

- **Air** - Hot reload for development (auto-installed via Makefile)
- **Docker** - Containerization (optional)
- **pgAdmin** - Database GUI (optional)

### Installation

#### Go
```bash
# Download from https://go.dev/dl/
# Or use package manager:

# Ubuntu/Debian
sudo apt install golang-go

# macOS
brew install go

# Verify installation
go version  # Should show 1.25+
```

#### PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@14

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@14  # macOS

# Verify installation
psql --version
```

---

## Environment Variables

### Configuration File

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

### Environment Variables Reference

#### General Service Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `VERSION` | string | No | 0.0.1 | Application version |
| `MODE` | string | No | debug | Run mode: `debug` or `release` |
| `SERVICE_NAME` | string | No | gw2style | Service identifier |
| `HTTP_PORT` | integer | No | 8080 | HTTP server port |
| `JWT_SECRET` | string | **Yes** | - | Secret key for JWT signing (min 32 chars) |
| `MIGRATION_SOURCE` | string | No | file://db/migrations | Migration files location |

#### Database Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DB_HOST` | string | Yes | 127.0.0.1 | PostgreSQL host |
| `DB_PORT` | integer | Yes | 5432 | PostgreSQL port |
| `DB_NAME` | string | Yes | gw2style | Database name |
| `DB_USER` | string | Yes | postgres | Database user |
| `DB_PASSWORD` | string | Yes | - | Database password |
| `DB_MAX_IDLE_TIME_IN_MINUTES` | integer | No | 60 | Max idle connection time |
| `DB_MAX_OPEN_CONNS` | integer | No | 20 | Max open connections |
| `DB_MAX_IDLE_CONNS` | integer | No | 20 | Max idle connections |
| `DB_ENABLE_SSL_MODE` | boolean | No | false | Enable SSL for DB connection |

#### Discord Bot Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DISCORD_BOT_TOKEN` | string | **Yes** | - | Discord bot token |
| `DISCORD_WEBHOOK_URL` | string | **Yes** | - | Moderation channel webhook URL |
| `DISCORD_MOD_CHANNEL_ID` | string | **Yes** | - | Moderation channel ID |
| `DISCORD_PUBLIC_WEBHOOK_URL` | string | No | - | Public announcement webhook URL |

### Example `.env` File

```bash
# General Service Info
VERSION=0.2.0
MODE=debug
SERVICE_NAME=gw2style
HTTP_PORT=8080
MIGRATION_SOURCE=file://db/migrations
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Discord Bot Configuration
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
DISCORD_MOD_CHANNEL_ID=123456789012345678
DISCORD_PUBLIC_WEBHOOK_URL=https://discord.com/api/webhooks/PUBLIC_WEBHOOK_ID/PUBLIC_WEBHOOK_TOKEN

# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=gw2style
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_MAX_IDLE_TIME_IN_MINUTES=60
DB_MAX_OPEN_CONNS=20
DB_MAX_IDLE_CONNS=20
DB_ENABLE_SSL_MODE=false
```

### Security Notes

> **⚠️ IMPORTANT**: Never commit `.env` files to version control!

- Add `.env` to `.gitignore` (already done)
- Use strong, random values for `JWT_SECRET`
- Rotate secrets regularly in production
- Use environment-specific `.env` files (`.env.dev`, `.env.prod`)

---

## Local Development Setup

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/NesoHQ/gw2style.git
cd gw2style/backend
```

#### 2. Install Dependencies

```bash
# Download Go modules
make deps

# Or manually:
go mod download
go mod tidy
```

#### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or vim, code, etc.
```

#### 4. Set Up Database

See [Database Setup](#database-setup) section below.

#### 5. Run the Application

```bash
# Development mode with hot reload
make dev

# Or without hot reload
make run
```

The server will start on `http://localhost:8080`.

---

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE gw2style;
CREATE USER gw2style_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gw2style TO gw2style_user;

# Exit psql
\q
```

### 2. Update `.env` File

```bash
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=gw2style
DB_USER=gw2style_user
DB_PASSWORD=your_password
```

### 3. Run Migrations

Migrations run automatically on application startup. Alternatively:

```bash
# Migrations are in db/migrations/
# They run automatically when you start the app

# To verify migrations:
psql -U gw2style_user -d gw2style -c "\dt"
```

You should see tables:
- `users`
- `posts`
- `reports`
- `moderation_log`
- `gorp_migrations` (migration tracking)

### 4. Verify Database

```bash
# Connect to database
psql -U gw2style_user -d gw2style

# List tables
\dt

# Check users table
SELECT * FROM users;

# Exit
\q
```

---

## Discord Bot Configuration

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "GW2STYLE Moderator"
4. Go to "Bot" tab
5. Click "Add Bot"
6. Copy the bot token → use for `DISCORD_BOT_TOKEN`

### 2. Bot Permissions

Required permissions:
- Read Messages/View Channels
- Send Messages
- Embed Links
- Add Reactions
- Read Message History

**Permission Integer**: `379968`

### 3. Invite Bot to Server

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=379968&scope=bot
```

Replace `YOUR_CLIENT_ID` with your application's client ID.

### 4. Create Webhooks

#### Moderation Channel Webhook

1. Go to your moderation channel settings
2. Integrations → Webhooks → New Webhook
3. Name it "GW2STYLE Moderation"
4. Copy webhook URL → use for `DISCORD_WEBHOOK_URL`
5. Copy channel ID → use for `DISCORD_MOD_CHANNEL_ID`

#### Public Channel Webhook (Optional)

1. Go to your public announcements channel
2. Create webhook
3. Copy URL → use for `DISCORD_PUBLIC_WEBHOOK_URL`

### 5. Get Channel ID

1. Enable Developer Mode in Discord (User Settings → Advanced)
2. Right-click channel → Copy ID
3. Use for `DISCORD_MOD_CHANNEL_ID`

### 6. Test Bot

```bash
# Start the backend
make dev

# Create a test post via API
# Check if notification appears in Discord moderation channel
```

---

## Running the Application

### Development Mode

```bash
# With hot reload (recommended)
make dev

# Without hot reload
make run

# Direct Go command
go run .
```

**Output**:
```
[INFO] Starting GW2STYLE backend v0.2.0
[INFO] Database connected successfully
[INFO] Running migrations...
[INFO] Discord bot started
[INFO] Server listening on :8080
```

### Available Make Commands

```bash
make help          # Show all available commands
make dev           # Run with hot reload (Air)
make run           # Run without hot reload
make build         # Build production binary
make test          # Run tests
make clean         # Clean build artifacts
make deps          # Download dependencies
```

### Verify Server is Running

```bash
# Health check (if implemented)
curl http://localhost:8080/health

# Get posts
curl http://localhost:8080/api/v1/posts
```

---

## Building for Production

### 1. Build Binary

```bash
# Build optimized binary
make build

# Binary will be in bin/gw2style
./bin/gw2style
```

### 2. Production Environment Variables

```bash
# Set production mode
MODE=release

# Use production database
DB_HOST=your-production-db-host
DB_ENABLE_SSL_MODE=true

# Strong JWT secret
JWT_SECRET=<64-character-random-string>
```

### 3. Optimize Build

```bash
# Build with optimizations
go build -ldflags="-s -w" -o bin/gw2style .

# Reduce binary size further
upx bin/gw2style  # Requires UPX installed
```

---

## Deployment

### Option 1: Docker Deployment

#### Create `Dockerfile`

```dockerfile
FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -ldflags="-s -w" -o gw2style .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/gw2style .
COPY --from=builder /app/db/migrations ./db/migrations

EXPOSE 8080
CMD ["./gw2style"]
```

#### Build and Run

```bash
# Build image
docker build -t gw2style-backend .

# Run container
docker run -p 8080:8080 --env-file .env gw2style-backend
```

### Option 2: Kubernetes (k3s)

#### Create Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gw2style-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gw2style-backend
  template:
    metadata:
      labels:
        app: gw2style-backend
    spec:
      containers:
      - name: backend
        image: gw2style-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: host
        # ... other env vars
```

### Option 3: Systemd Service

```ini
[Unit]
Description=GW2STYLE Backend
After=network.target postgresql.service

[Service]
Type=simple
User=gw2style
WorkingDirectory=/opt/gw2style
EnvironmentFile=/opt/gw2style/.env
ExecStart=/opt/gw2style/bin/gw2style
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable gw2style
sudo systemctl start gw2style
sudo systemctl status gw2style
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `pq: password authentication failed`

**Solution**:
- Check `DB_USER` and `DB_PASSWORD` in `.env`
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check `pg_hba.conf` for authentication settings

#### 2. Port Already in Use

**Error**: `bind: address already in use`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change HTTP_PORT in .env
```

#### 3. Migration Errors

**Error**: `migration failed: table already exists`

**Solution**:
```bash
# Check migration status
psql -U gw2style_user -d gw2style -c "SELECT * FROM gorp_migrations;"

# Reset database (CAUTION: deletes all data)
psql -U postgres -c "DROP DATABASE gw2style;"
psql -U postgres -c "CREATE DATABASE gw2style;"
```

#### 4. Discord Bot Not Responding

**Error**: Bot doesn't react to emoji reactions

**Solution**:
- Verify `DISCORD_BOT_TOKEN` is correct
- Check bot has "Read Message History" permission
- Ensure `DISCORD_MOD_CHANNEL_ID` matches the channel
- Check bot is online in Discord

#### 5. JWT Token Invalid

**Error**: `401 Unauthorized` on protected endpoints

**Solution**:
- Verify JWT token is included in `Authorization: Bearer <token>` header
- Check `JWT_SECRET` hasn't changed
- Token may be expired (default: 7 days)

### Logging

Enable debug logging:

```bash
# Set in .env
MODE=debug

# View logs
tail -f /var/log/gw2style/app.log  # If using systemd
```

### Database Debugging

```bash
# Check database connections
psql -U gw2style_user -d gw2style -c "SELECT * FROM pg_stat_activity;"

# Check table sizes
psql -U gw2style_user -d gw2style -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

---

## Development Tips

### Hot Reload with Air

Air automatically restarts the server when code changes:

```bash
# Install Air (done automatically by make dev)
go install github.com/air-verse/air@latest

# Run with Air
air

# Configuration in .air.toml
```

### Database Seeding

Create test data:

```sql
-- Insert test user
INSERT INTO users (id, username, api_key) 
VALUES ('test-id', 'TestUser.1234', 'test-api-key');

-- Insert test post
INSERT INTO posts (title, thumbnail_url, author_name, published) 
VALUES ('Test Post', 'https://example.com/img.jpg', 'TestUser.1234', true);
```

### API Testing

Use `curl` or Postman:

```bash
# Login
curl -X POST http://localhost:8080/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_GW2_API_KEY"}'

# Get posts
curl http://localhost:8080/api/v1/posts

# Create post (with JWT)
curl -X POST http://localhost:8080/api/v1/posts/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Outfit",
    "thumbnail_url": "https://example.com/img.jpg",
    "tags": ["light", "human"]
  }'
```

---

## Next Steps

After successful setup:

1. ✅ Verify all endpoints work
2. ✅ Test Discord moderation workflow
3. ✅ Set up frontend application
4. ✅ Configure production environment
5. ✅ Set up monitoring and logging
6. ✅ Configure backups

---

## Additional Resources

- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Discord Community](https://discord.com/invite/xvArbFbh34)

---

**Last Updated**: December 2025  
**Version**: 0.2.0
