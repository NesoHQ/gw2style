# 🧥 GW2STYLE Backend

> **A community-driven fashion archive for Guild Wars 2 players**

[![Go Version](https://img.shields.io/badge/Go-1.25+-00ADD8?style=flat&logo=go)](https://go.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Open_Source-green.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join_Us-7289DA?style=flat&logo=discord)](https://discord.com/invite/xvArbFbh34)

---

## 📖 Overview

GW2STYLE is a REST API backend that powers a fashion archive platform for Guild Wars 2. Players can:

- 🔐 **Authenticate** using GW2 API keys (no passwords!)
- 📸 **Share** character outfits with detailed equipment info
- 🔍 **Discover** outfits through search and tag filtering
- ❤️ **Engage** with likes and leaderboards
- 🛡️ **Moderate** content via Discord bot integration

**Tech Stack**: Go • PostgreSQL • Discord Bot • JWT Authentication

---

## 🚀 Quick Start

### Prerequisites

- Go 1.25+
- PostgreSQL 14+
- Discord Bot Token (for moderation)

### Installation

```bash
# Clone repository
git clone https://github.com/NesoHQ/gw2style.git
cd gw2style/backend

# Install dependencies
make deps

# Configure environment
cp .env.example .env
# Edit .env with your database and Discord credentials

# Run with hot reload
make dev
```

Server starts at `http://localhost:8080` 🎉

**Detailed setup**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** | Architecture, tech stack, and project structure |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Complete API reference with all endpoints |
| **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** | Database schema, relationships, and migrations |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Business logic, workflows, and design patterns |
| **[BACKEND_SETUP.md](BACKEND_SETUP.md)** | Environment setup, configuration, and deployment |

---

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         REST API (Go)               │
│  ┌──────────┐  ┌──────────────┐   │
│  │ Handlers │  │ Middlewares  │   │
│  └────┬─────┘  └──────┬───────┘   │
│       │               │            │
│       ▼               ▼            │
│  ┌──────────┐  ┌──────────────┐   │
│  │   Repo   │  │  Auth (JWT)  │   │
│  └────┬─────┘  └──────────────┘   │
└───────┼────────────────────────────┘
        │
        ▼
┌─────────────┐      ┌──────────────┐
│ PostgreSQL  │      │ Discord Bot  │
└─────────────┘      └──────────────┘
        │                    │
        │                    ▼
        │            ┌──────────────┐
        └───────────▶│  GW2 API     │
                     └──────────────┘
```

**Key Features**:
- Clean architecture with repository pattern
- JWT-based authentication
- Discord bot for content moderation
- Tag-based search with GIN indexes
- Comprehensive error handling

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/login` - Login with GW2 API key
- `GET /api/v1/user/me` - Get current user

### Posts
- `GET /api/v1/posts` - List all posts (paginated)
- `GET /api/v1/posts/search` - Search and filter posts
- `GET /api/v1/posts/popular` - Get leaderboard
- `GET /api/v1/posts/{id}` - Get post details
- `POST /api/v1/posts/create` - Create new post (auth required)
- `DELETE /api/v1/posts/{id}` - Delete post (auth required)

### Likes
- `POST /api/v1/posts/{id}/like` - Like a post
- `DELETE /api/v1/posts/{id}/like` - Unlike a post
- `GET /api/v1/posts/{id}/like` - Check like status

### Moderation (Bot-authenticated)
- `POST /api/v1/admin/posts/{id}/publish` - Approve post
- `POST /api/v1/admin/posts/{id}/reject` - Reject post
- `POST /api/v1/posts/{id}/report` - Report post

**Full API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 💾 Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `users` | GW2 player accounts |
| `posts` | Outfit submissions |
| `reports` | User-submitted reports |
| `moderation_log` | Audit trail for moderation |

### Key Relationships

```
users (1) ──── (N) posts
posts (1) ──── (N) reports
posts (1) ──── (N) moderation_log
```

**Full Schema**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 🛠️ Development

### Available Commands

```bash
make dev      # Run with hot reload (Air)
make run      # Run without hot reload
make build    # Build production binary
make test     # Run tests
make clean    # Clean build artifacts
make deps     # Download dependencies
make help     # Show all commands
```

### Project Structure

```
backend/
├── bot/              # Discord bot for moderation
├── cmd/              # CLI commands
├── config/           # Configuration management
├── db/               # Database layer
│   └── migrations/   # SQL migration files
├── logger/           # Logging utilities
├── repo/             # Repository layer (data access)
├── rest/             # REST API layer
│   ├── handlers/     # HTTP request handlers
│   ├── middlewares/  # HTTP middlewares
│   └── utils/        # HTTP utilities
├── .env.example      # Environment template
├── Makefile          # Build automation
└── main.go           # Application entry point
```

---

## 🔐 Environment Variables

### Required Variables

```bash
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=gw2style
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_WEBHOOK_URL=your_webhook_url
DISCORD_MOD_CHANNEL_ID=channel_id
```

**Full Configuration Guide**: [BACKEND_SETUP.md](BACKEND_SETUP.md)

---

## 🎯 Key Features

### 1. Passwordless Authentication
- Uses Guild Wars 2 API keys
- No password management overhead
- Automatic user verification via GW2 API

### 2. Discord-Based Moderation
- All posts require moderator approval
- Approve/reject via Discord emoji reactions (✅/❌)
- Automated notifications and announcements
- Complete audit trail

### 3. Advanced Search & Filtering
- Tag-based filtering with GIN indexes
- Full-text search in titles/descriptions
- Author filtering
- Pagination support

### 4. Performance Optimized
- Database connection pooling
- Efficient JSONB queries
- Partial indexes for common patterns
- Concurrent request handling

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
make test

# Run specific package tests
go test ./repo/...
go test ./rest/handlers/...

# Run with coverage
go test -cover ./...
```

### API Testing

```bash
# Test login
curl -X POST http://localhost:8080/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_GW2_API_KEY"}'

# Test get posts
curl http://localhost:8080/api/v1/posts?limit=10
```

---

## 🚢 Deployment

### Docker

```bash
# Build image
docker build -t gw2style-backend .

# Run container
docker run -p 8080:8080 --env-file .env gw2style-backend
```

### Kubernetes (k3s)

```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods -l app=gw2style-backend
```

### Systemd Service

```bash
# Copy service file
sudo cp gw2style.service /etc/systemd/system/

# Enable and start
sudo systemctl enable gw2style
sudo systemctl start gw2style
```

**Detailed Deployment Guide**: [BACKEND_SETUP.md](BACKEND_SETUP.md#deployment)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `make test`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Areas to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🧪 Test coverage
- 🎨 Code quality improvements

**Join our Discord**: [https://discord.com/invite/xvArbFbh34](https://discord.com/invite/xvArbFbh34)

---

## 📊 Project Status

### Current Version: v0.2.0

#### ✅ Implemented Features
- GW2 API key authentication
- Post CRUD operations
- Tag search and filtering
- Like/unlike system
- Discord moderation workflow
- Leaderboard (popular posts)
- User galleries

#### 🚧 In Progress
- Rate limiting
- Image upload (currently external URLs only)
- Advanced analytics

#### 📅 Planned Features
- Post editing
- Comments system
- User profiles
- Discord bot analytics commands

**Full Roadmap**: [../ROADMAP.md](../ROADMAP.md)

---

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials in .env
```

**Port already in use**
```bash
# Find process using port 8080
lsof -i :8080

# Change port in .env
HTTP_PORT=8081
```

**Discord bot not responding**
```bash
# Verify bot token
# Check bot permissions
# Ensure bot is in the server
```

**Full Troubleshooting Guide**: [BACKEND_SETUP.md](BACKEND_SETUP.md#troubleshooting)

---

## 📝 License

This project is open-source. See [LICENSE](../LICENSE) for details.

---

## 🔗 Links

- **Frontend Repository**: [Coming Soon]
- **Discord Community**: [Join Here](https://discord.com/invite/xvArbFbh34)
- **GW2 Official API**: [wiki.guildwars2.com/wiki/API](https://wiki.guildwars2.com/wiki/API:Main)
- **Project Roadmap**: [ROADMAP.md](../ROADMAP.md)
- **Feature Documentation**: [FEATURES.md](../FEATURES.md)

---

## 👥 Team

Built with ❤️ by the GW2STYLE community

**Maintainers**: See [CONTRIBUTORS.md](../CONTRIBUTORS.md)

---

## 📞 Support

- **Discord**: [https://discord.com/invite/xvArbFbh34](https://discord.com/invite/xvArbFbh34)
- **GitHub Issues**: [Report a bug](https://github.com/NesoHQ/gw2style/issues)
- **Documentation**: See [docs/](docs/) folder

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made for the Guild Wars 2 community 🎮

</div>
