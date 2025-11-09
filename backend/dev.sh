#!/bin/bash

# Development script with Air hot reloading

echo "🚀 Starting GW2Style Backend with Hot Reloading..."
echo ""

# Check if Air is installed
if ! command -v air &> /dev/null; then
    echo "📦 Air not found. Installing..."
    go install github.com/air-verse/air@latest
    echo "✅ Air installed successfully!"
    echo ""
fi

# Run Air
echo "🔥 Starting Air..."
air
