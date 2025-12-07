.PHONY: build deploy clean help

# Variables
BUILD_DIR = out
DEPLOY_DIR = /var/www/gw2style

# Default target
help:
	@echo "Available targets:"
	@echo "  build       - Build the Next.js frontend"
	@echo "  deploy      - Deploy the built frontend to $(DEPLOY_DIR)"
	@echo "  clean       - Remove the build directory"
	@echo "  all         - Build and deploy (default workflow)"
	@echo ""
	@echo "Usage:"
	@echo "  make build  - Just build the project"
	@echo "  make deploy - Build and deploy to production"
	@echo "  make clean  - Clean build artifacts"

# Build the Next.js application
build:
	@echo "Building Next.js frontend..."
	npm run build
	@echo "Build completed successfully!"

# Deploy to production
deploy: build
	@echo "Deploying to $(DEPLOY_DIR)..."
	@echo "Removing old files from $(DEPLOY_DIR)..."
	sudo rm -rf $(DEPLOY_DIR)/*
	@echo "Copying new build to $(DEPLOY_DIR)..."
	sudo cp -r $(BUILD_DIR)/* $(DEPLOY_DIR)/
	@echo "Setting proper permissions..."
	sudo chown -R www-data:www-data $(DEPLOY_DIR)
	sudo chmod -R 755 $(DEPLOY_DIR)
	@echo "Deployment completed successfully!"

# Clean build directory
clean:
	@echo "Cleaning build directory..."
	rm -rf $(BUILD_DIR)
	rm -rf .next
	@echo "Clean completed!"

# Build and deploy in one command
all: deploy
