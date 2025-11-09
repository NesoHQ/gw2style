<!-- ## 📚 Documentation

All relevant documentation is available inside the [`docs/`](docs/) directory:

-   [API Docs](docs/api-docs/) – Specifications, endpoints, authentication, and usage examples.
-   [Database Docs](docs/db-docs/) – Database schema, table descriptions, and migration guidelines.
-   [Architecture Decision Records (ADR)](docs/adr/) – Key design choices and their justifications.
-   [Docs Overview](docs/README.md) – Full documentation index and contribution guide. -->

# GW2Style Backend - Development Guide

## Quick Start

### Option 1: Using Make (Recommended)

```bash
# Install Air and start development server
make dev
```

### Option 2: Using the dev script

```bash
# Make the script executable (first time only)
chmod +x dev.sh

# Run the development server
./dev.sh
```

### Option 3: Manual Air installation

```bash
# Install Air
go install github.com/air-verse/air@latest

# Run Air
air
```

## What is Air?

Air is a live-reloading tool for Go applications. When you save changes to any `.go` file, Air automatically:
1. Rebuilds your application
2. Restarts the server
3. Shows build errors in the console

This dramatically speeds up development by eliminating manual rebuild/restart cycles.

## Configuration

Air is configured via `.air.toml` in the backend directory. Key settings:

- **Watched extensions**: `.go`, `.tpl`, `.tmpl`, `.html`
- **Excluded directories**: `assets`, `tmp`, `vendor`, `testdata`
- **Build output**: `./tmp/main`
- **Delay**: 1 second after file change

## Make Commands

```bash
make help          # Show all available commands
make dev           # Run with hot reloading (Air)
make run           # Run without hot reloading
make build         # Build the binary to bin/gw2style
make clean         # Clean build artifacts (tmp/, bin/)
make test          # Run tests
make deps          # Download and tidy dependencies
make install-air   # Install Air only
```

## Development Workflow

1. Start the development server:
   ```bash
   make dev
   ```

2. Make changes to any `.go` file

3. Save the file - Air will automatically:
   - Detect the change
   - Rebuild the application
   - Restart the server
   - Display any build errors

4. Test your changes immediately

## Troubleshooting

### Air not found
```bash
make install-air
```

### Port already in use
Check if another instance is running:
```bash
lsof -i :3000  # or your configured port
kill -9 <PID>
```

### Build errors not clearing
```bash
make clean
make dev
```

### Air not detecting changes
- Check that your files have `.go` extension
- Ensure you're not editing files in excluded directories
- Try restarting Air

## Environment Variables

Make sure you have a `.env` file in the backend directory with required variables:

```env
SERVICE_NAME=gw2style
MODE=debug
HTTP_PORT=3000
JWT_SECRET=your-secret-key
# ... other variables
```

## Tips

- Air logs are saved to `build-errors.log`
- Temporary build files are in `tmp/` directory
- Both are gitignored automatically
- Use `make clean` to remove all build artifacts
