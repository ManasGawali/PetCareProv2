#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if .env file exists, create basic one if not
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating basic .env file...');
  const envContent = `# PetCare Pro Backend Environment Configuration

# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database Configuration (Using SQLite for development)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=petcare-pro-jwt-secret-key-development-only-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Upload Configuration
MAX_FILE_SIZE=10mb
UPLOADS_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Development Settings
ENABLE_LOGGING=true
ENABLE_CORS=true`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 node_modules not found. Please run "npm install" first.');
  process.exit(1);
}

// Start the server
console.log('🚀 Starting PetCare Pro Backend Server...');
require('./server.js');