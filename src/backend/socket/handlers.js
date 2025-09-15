const jwt = require('jsonwebtoken');
const { User, Booking, ServiceProvider } = require('../models');

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error'));
  }
};

// Setup Socket.IO handlers
const setupSocketHandlers = (io) => {
  // Store io instance for use in other modules
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.full_name} connected via Socket.IO`);

    // Join booking tracking room
    socket.on('join_tracking', async (data) => {
      try {
        const { booking_id } = data;

        // Verify user has access to this booking
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            [socket.user.role === 'provider' ? 'provider_id' : 'user_id']: socket.user.id
          }
        });

        if (!booking) {
          socket.emit('error', { message: 'Booking not found or access denied' });
          return;
        }

        const roomName = `booking_${booking_id}`;
        socket.join(roomName);
        
        console.log(`User ${socket.user.full_name} joined tracking room: ${roomName}`);
        
        socket.emit('tracking_joined', {
          booking_id,
          room: roomName,
          message: 'Successfully joined tracking'
        });

        // Send current tracking status
        socket.emit('tracking_status', {
          booking_id,
          status: booking.status,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Join tracking error:', error);
        socket.emit('error', { message: 'Failed to join tracking' });
      }
    });

    // Leave booking tracking room
    socket.on('leave_tracking', (data) => {
      const { booking_id } = data;
      const roomName = `booking_${booking_id}`;
      socket.leave(roomName);
      
      console.log(`User ${socket.user.full_name} left tracking room: ${roomName}`);
      socket.emit('tracking_left', { booking_id, room: roomName });
    });

    // Provider location update
    socket.on('provider_location_update', async (data) => {
      try {
        const { booking_id, location } = data;

        // Verify user is the assigned provider
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            provider_id: socket.user.id
          }
        });

        if (!booking) {
          socket.emit('error', { message: 'Not authorized for this booking' });
          return;
        }

        // Broadcast location update to customer
        const roomName = `booking_${booking_id}`;
        socket.to(roomName).emit('provider_location', {
          booking_id,
          location,
          timestamp: new Date()
        });

        console.log(`Provider location updated for booking ${booking_id}`);

      } catch (error) {
        console.error('Provider location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Customer message to provider
    socket.on('customer_message', async (data) => {
      try {
        const { booking_id, message } = data;

        // Verify user owns this booking
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            user_id: socket.user.id
          },
          include: [
            {
              model: ServiceProvider,
              as: 'provider'
            }
          ]
        });

        if (!booking) {
          socket.emit('error', { message: 'Booking not found' });
          return;
        }

        const roomName = `booking_${booking_id}`;
        
        // Send message to provider
        socket.to(roomName).emit('message_from_customer', {
          booking_id,
          message,
          from: {
            name: socket.user.full_name,
            role: 'customer'
          },
          timestamp: new Date()
        });

        // Confirm to sender
        socket.emit('message_sent', {
          booking_id,
          message,
          timestamp: new Date()
        });

        console.log(`Customer message sent for booking ${booking_id}`);

      } catch (error) {
        console.error('Customer message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Provider message to customer
    socket.on('provider_message', async (data) => {
      try {
        const { booking_id, message } = data;

        // Verify user is the assigned provider
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            provider_id: socket.user.id
          }
        });

        if (!booking) {
          socket.emit('error', { message: 'Not authorized for this booking' });
          return;
        }

        const roomName = `booking_${booking_id}`;
        
        // Send message to customer
        socket.to(roomName).emit('message_from_provider', {
          booking_id,
          message,
          from: {
            name: socket.user.full_name,
            role: 'provider'
          },
          timestamp: new Date()
        });

        // Confirm to sender
        socket.emit('message_sent', {
          booking_id,
          message,
          timestamp: new Date()
        });

        console.log(`Provider message sent for booking ${booking_id}`);

      } catch (error) {
        console.error('Provider message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ETA update from provider
    socket.on('eta_update', async (data) => {
      try {
        const { booking_id, eta } = data;

        // Verify user is the assigned provider
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            provider_id: socket.user.id
          }
        });

        if (!booking) {
          socket.emit('error', { message: 'Not authorized for this booking' });
          return;
        }

        const roomName = `booking_${booking_id}`;
        
        // Broadcast ETA to customer
        socket.to(roomName).emit('eta_updated', {
          booking_id,
          eta,
          timestamp: new Date()
        });

        console.log(`ETA updated for booking ${booking_id}: ${eta} minutes`);

      } catch (error) {
        console.error('ETA update error:', error);
        socket.emit('error', { message: 'Failed to update ETA' });
      }
    });

    // Service status update
    socket.on('service_status_update', async (data) => {
      try {
        const { booking_id, status, message } = data;

        // Verify user is the assigned provider
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            provider_id: socket.user.id
          }
        });

        if (!booking) {
          socket.emit('error', { message: 'Not authorized for this booking' });
          return;
        }

        // Update booking status in database
        await booking.update({ status });

        const roomName = `booking_${booking_id}`;
        
        // Broadcast status update to customer
        socket.to(roomName).emit('service_status_updated', {
          booking_id,
          status,
          message,
          timestamp: new Date()
        });

        console.log(`Service status updated for booking ${booking_id}: ${status}`);

      } catch (error) {
        console.error('Service status update error:', error);
        socket.emit('error', { message: 'Failed to update service status' });
      }
    });

    // Emergency alert
    socket.on('emergency_alert', async (data) => {
      try {
        const { booking_id, message } = data;

        // Verify user has access to this booking
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            [socket.user.role === 'provider' ? 'provider_id' : 'user_id']: socket.user.id
          }
        });

        if (!booking) {
          socket.emit('error', { message: 'Booking not found' });
          return;
        }

        const roomName = `booking_${booking_id}`;
        
        // Broadcast emergency alert
        io.to(roomName).emit('emergency_alert', {
          booking_id,
          message,
          from: {
            name: socket.user.full_name,
            role: socket.user.role
          },
          timestamp: new Date()
        });

        // Also notify admin channels
        io.to('admin_room').emit('emergency_alert', {
          booking_id,
          message,
          from: {
            name: socket.user.full_name,
            role: socket.user.role
          },
          timestamp: new Date()
        });

        console.log(`Emergency alert for booking ${booking_id}: ${message}`);

      } catch (error) {
        console.error('Emergency alert error:', error);
        socket.emit('error', { message: 'Failed to send emergency alert' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.full_name} disconnected from Socket.IO`);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  });

  // Periodic location simulation for demo purposes
  setInterval(() => {
    // Simulate provider location updates for active bookings
    io.emit('demo_location_update', {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
      timestamp: new Date()
    });
  }, 30000); // Every 30 seconds

  console.log('✅ Socket.IO handlers setup complete');
};

module.exports = { setupSocketHandlers };