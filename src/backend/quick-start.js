#!/usr/bin/env node

// Quick start script for PetCare Pro Backend
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PetCare Pro Backend Quick Start');
console.log('===================================');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this from the backend directory.');
  console.log('💡 Try: cd backend && node quick-start.js');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = `# PetCare Pro Backend Environment Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=petcare-pro-jwt-secret-key-development
JWT_EXPIRES_IN=7d
ENABLE_LOGGING=true
ENABLE_CORS=true`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ Created .env file');
}

console.log('🎯 Starting test server...');
console.log('');

// Start the test server
require('./test-server.js');