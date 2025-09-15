#!/usr/bin/env node

// Minimal test server to verify basic functionality
const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config();
} catch (e) {
  console.log('No .env file found, using defaults');
}

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Initializing PetCare Pro Test Server...');

// Basic middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    version: '1.0.0',
    message: 'PetCare Pro Backend Test Server',
    uptime: process.uptime(),
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
  };
  
  console.log('Health check requested:', health);
  res.status(200).json(health);
});

// Basic API endpoints for testing
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: false,
    message: 'This is a test server - auth endpoints are not implemented'
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: false,
    message: 'This is a test server - auth endpoints are not implemented'
  });
});

// Mock cart endpoint
app.get('/api/cart/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalItems: 0,
      subtotal: 0,
      hasItems: false
    }
  });
});

// Catch all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found in test server`,
    availableRoutes: [
      'GET /health',
      'GET /api/test',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/cart/summary'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server with better error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 PetCare Pro Test Server started successfully!');
  console.log('================================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('');
  console.log('✅ Ready to receive requests!');
  console.log('💡 Visit the health check URL in your browser to verify connectivity.');
  console.log('💡 Your frontend should now be able to connect successfully.');
  console.log('');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.log('💡 Try one of these solutions:');
    console.log('   1. Kill the process using the port: lsof -ti:3001 | xargs kill -9');
    console.log('   2. Use a different port: PORT=3002 node test-server.js');
    console.log('   3. Check what\'s running: lsof -i :3001');
  } else {
    console.error('❌ Server failed to start:', err);
  }
  process.exit(1);
});