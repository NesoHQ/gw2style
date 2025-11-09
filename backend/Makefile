.PHONY: help dev build run clean install-air

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install-air: ## Install Air for hot reloading
	@which air > /dev/null || (echo "Installing Air..." && go install github.com/air-verse/air@latest)
	@echo "Air is installed!"

dev: install-air ## Run the backend with hot reloading using Air
	air

build: ## Build the backend binary
	go build -o bin/gw2style .

run: ## Run the backend without hot reloading
	go run .

clean: ## Clean build artifacts
	rm -rf tmp/
	rm -rf bin/
	rm -f build-errors.log

test: ## Run tests
	go test -v ./...

deps: ## Download dependencies
	go mod download
	go mod tidy
