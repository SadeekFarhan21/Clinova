#!/bin/bash
# Quick start script for Clinova

echo "=========================================="
echo "Clinova - Virtual Clinical Trial Platform"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your API keys before continuing"
    echo ""
    read -p "Press Enter after you've configured .env, or Ctrl+C to exit..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🚀 Starting Clinova services..."
echo ""

# Start services
docker-compose up --build

# If user stops with Ctrl+C, clean up
trap "echo ''; echo '🛑 Stopping services...'; docker-compose down; exit 0" INT TERM
