#!/bin/bash

# HKT Platform - Application Update Script
# Use this to deploy updates from GitHub

set -e

echo "Updating HKT Platform..."

cd /home/ubuntu/apps/hkt-platform

# Stop the application
echo "Stopping application..."
pm2 stop hkt-platform

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "Updating dependencies..."
npm install

# Skip build - use development server
echo "Skipping build - using development server..."

# Run database migrations (if needed)
echo "Updating database schema..."
npm run db:push

# Restart application
echo "Restarting application..."
pm2 restart hkt-platform

# Check status
pm2 status

echo "Update completed successfully!"
echo ""
echo "Application status:"
pm2 show hkt-platform