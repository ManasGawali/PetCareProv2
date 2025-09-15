const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Try to load database config, but don't fail if it doesn't work
let sequelize;
try {
  const { sequelize: db } = require('./config/database');
  sequelize = db;
} catch (dbError) {
  console.warn('Database configuration failed:', dbError.message);
  // Create a mock sequelize object
  sequelize = {
    authenticate: () => Promise.reject(new Error('Database not configured')),
    sync: () => Promise.reject(new Error('Database not configured'))
  };
}
// Try to load routes, but provide fallbacks if they fail
let authRoutes, userRoutes, serviceRoutes, bookingRoutes, productRoutes, 
    cartRoutes, orderRoutes, reviewRoutes, trackingRoutes, errorHandler, setupSocketHandlers;

const mockRoute = (req, res) => {
  res.status(503).json({
    success: false,
    message: 'This endpoint is temporarily unavailable - backend setup in progress'
  });
};

const mockRouter = { 
  get: mockRoute,
  post: mockRoute,
  put: mockRoute,
  delete: mockRoute,
  use: () => mockRouter
};

try {
  authRoutes = require('./routes/auth');
} catch (e) { authRoutes = mockRouter; }

try {
  userRoutes = require('./routes/users');
} catch (e) { userRoutes = mockRouter; }

try {
  serviceRoutes = require('./routes/services');
} catch (e) { serviceRoutes = mockRouter; }

try {
  bookingRoutes = require('./routes/bookings');
} catch (e) { bookingRoutes = mockRouter; }

try {
  productRoutes = require('./routes/products');
} catch (e) { productRoutes = mockRouter; }

try {
  cartRoutes = require('./routes/cart');
} catch (e) { cartRoutes = mockRouter; }

try {
  orderRoutes = require('./routes/orders');
} catch (e) { orderRoutes = mockRouter; }

try {
  reviewRoutes = require('./routes/reviews');
} catch (e) { reviewRoutes = mockRouter; }

try {
  trackingRoutes = require('./routes/tracking');
} catch (e) { trackingRoutes = mockRouter; }

try {
  const { errorHandler: eh } = require('./middleware/errorHandler');
  errorHandler = eh;
} catch (e) { 
  errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  };
}

try {
  const { setupSocketHandlers: ssh } = require('./socket/handlers');
  setupSocketHandlers = ssh;
} catch (e) { 
  setupSocketHandlers = () => console.log('Socket handlers not available');
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Basic health check
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      version: '1.0.0'
    };

    // Test database connection if available
    try {
      await sequelize.authenticate();
      health.database = 'connected';
    } catch (dbError) {
      health.database = 'disconnected';
      health.database_error = dbError.message;
    }

    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tracking', trackingRoutes);

// Store io instance for access in routes
app.set('io', io);

// Socket.IO setup
setupSocketHandlers(io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;

// Database connection and server start
const startServer = async () => {
  try {
    // Try to connect to database, but don't fail if it doesn't work
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
      
      // Sync database models
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      console.log('✅ Database models synchronized.');
    } catch (dbError) {
      console.warn('⚠️ Database connection failed, starting in API-only mode:', dbError.message);
      console.log('💡 The server will start but database operations may fail.');
    }
    
    server.listen(PORT, () => {
      console.log(`🚀 PetCare Pro API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

module.exports = { app, server, io };