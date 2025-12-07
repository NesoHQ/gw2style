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
| **PostgreSQL** | 17+ | Database |
| **Make** | Any | Build automation |
| **Git** | Any | Version control |

### Optional Tools

- **Air** - Hot reload for development (auto-installed via Makefile)
- **Docker** - Containerization (optional)
- **pgAdmin** - Database GUI (optional)

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
| `HTTP_PORT` | integer | No | - | HTTP server port |
| `JWT_SECRET` | string | **Yes** | - | Secret key for JWT signing (min 32 chars) |
| `MIGRATION_SOURCE` | string | No | file://db/migrations | Migration files location |

#### Database Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DB_HOST` | string | Yes | - | PostgreSQL host |
| `DB_PORT` | integer | Yes | 5432 | PostgreSQL port |
| `DB_NAME` | string | Yes | - | Database name |
| `DB_USER` | string | Yes | - | Database user |
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
HTTP_PORT=your_port_number
MIGRATION_SOURCE=file://db/migrations
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Discord Bot Configuration
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
DISCORD_MOD_CHANNEL_ID=123456789012345678
DISCORD_PUBLIC_WEBHOOK_URL=https://discord.com/api/webhooks/PUBLIC_WEBHOOK_ID/PUBLIC_WEBHOOK_TOKEN

# Database
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
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

The server will start on the configured port.

---

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE your_database_name;
CREATE USER your_database_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_database_user;

# Exit psql
\q
```

### 2. Update `.env` File

```bash
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_password
```

### 3. Run Migrations

Migrations run automatically on application startup. Alternatively:

```bash
# Migrations are in db/migrations/
# They run automatically when you start the app

# To verify migrations:
psql -U your_database_user -d your_database_name -c "\dt"
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
psql -U your_database_user -d your_database_name

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
INFO No new migrations to apply
INFO Discord bot is now running
INFO Server and Discord bot are running. Press CTRL+C to exit.
INFO Listening at :YOUR_PORT
```

### Available Make Commands

```bash
make help          # Show all available commands
make dev           # Run with hot reload (Air)
make run           # Run without hot reload
make build         # Build production binary
make clean         # Clean build artifacts
make deps          # Download dependencies
```

### Verify Server is Running

```bash
# Get posts (replace port with your configured port)
curl http://localhost:YOUR_PORT/api/v1/posts
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

## Additional Resources

- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Discord Community](https://discord.com/invite/xvArbFbh34)

---

**Last Updated**: December 2025  
**Version**: 0.2.0
