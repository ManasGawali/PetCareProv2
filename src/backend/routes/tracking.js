const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { Booking, Service, Pet, User, ServiceProvider, TrackingUpdate } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tracking/:bookingId
// @desc    Get tracking information for a booking
// @access  Private
router.get('/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking and verify ownership
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        user_id: req.user.id
      },
      include: [
        {
          model: Service,
          as: 'service'
        },
        {
          model: Pet,
          as: 'pet'
        },
        {
          model: ServiceProvider,
          as: 'provider',
          required: false
        },
        {
          model: TrackingUpdate,
          as: 'tracking_updates',
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Calculate ETA and progress based on status
    let eta = null;
    let progress = 0;
    let currentStatus = booking.status;

    switch (booking.status) {
      case 'assigned':
        progress = 1;
        eta = { minutes: 15, seconds: 30 }; // Mock ETA
        break;
      case 'en_route':
        progress = 2;
        eta = { minutes: 8, seconds: 45 }; // Mock ETA
        break;
      case 'arrived':
        progress = 3;
        eta = { minutes: 0, seconds: 0 };
        break;
      case 'in_progress':
        progress = 4;
        eta = null; // No ETA for in-progress
        break;
      case 'completed':
        progress = 5;
        eta = null;
        break;
      default:
        progress = 0;
        eta = null;
    }

    // Mock real-time location data (in a real app, this would come from GPS)
    const mockLocation = {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
      heading: Math.floor(Math.random() * 360),
      speed: Math.floor(Math.random() * 30) + 10 // 10-40 mph
    };

    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          status: currentStatus,
          scheduled_date: booking.scheduled_date,
          scheduled_time: booking.scheduled_time,
          service: booking.service,
          pet: booking.pet,
          provider: booking.provider,
          service_address: booking.service_address
        },
        tracking: {
          current_status: currentStatus,
          progress,
          eta,
          provider_location: mockLocation,
          tracking_updates: booking.tracking_updates
        }
      }
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tracking/:bookingId/update
// @desc    Update tracking status (for service providers)
// @access  Private
router.post('/:bookingId/update', [
  auth,
  body('status').isIn(['assigned', 'en_route', 'arrived', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message must be less than 500 characters'),
  body('location').optional().isObject().withMessage('Location must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { bookingId } = req.params;
    const { status, message, location } = req.body;

    // Find booking
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: ServiceProvider,
          as: 'provider'
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is the assigned service provider (or admin)
    if (req.user.role !== 'admin' && booking.provider_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Update booking status
    await booking.update({ status });

    // Create tracking update
    const trackingUpdate = await TrackingUpdate.create({
      booking_id: bookingId,
      status,
      message,
      location,
      updated_by: req.user.id
    });

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`booking_${bookingId}`).emit('tracking_update', {
        booking_id: bookingId,
        status,
        message,
        location,
        timestamp: trackingUpdate.created_at
      });
    }

    res.json({
      success: true,
      message: 'Tracking updated successfully',
      data: {
        tracking_update: trackingUpdate
      }
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tracking/:bookingId/history
// @desc    Get complete tracking history for a booking
// @access  Private
router.get('/:bookingId/history', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking and verify ownership or provider access
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && 
        booking.user_id !== req.user.id && 
        booking.provider_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking history'
      });
    }

    // Get all tracking updates
    const trackingHistory = await TrackingUpdate.findAll({
      where: { booking_id: bookingId },
      include: [
        {
          model: User,
          as: 'updater',
          attributes: ['full_name', 'role']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        booking_id: bookingId,
        tracking_history: trackingHistory
      }
    });
  } catch (error) {
    console.error('Get tracking history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tracking/:bookingId/join
// @desc    Join real-time tracking for a booking
// @access  Private
router.post('/:bookingId/join', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking and verify ownership
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        user_id: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Return connection token for Socket.IO
    res.json({
      success: true,
      data: {
        booking_id: bookingId,
        socket_room: `booking_${bookingId}`,
        message: 'Ready to join real-time tracking'
      }
    });
  } catch (error) {
    console.error('Join tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tracking/active
// @desc    Get all active trackings for user
// @access  Private
router.get('/active', auth, async (req, res) => {
  try {
    const activeBookings = await Booking.findAll({
      where: {
        user_id: req.user.id,
        status: {
          [Op.in]: ['assigned', 'en_route', 'arrived', 'in_progress']
        }
      },
      include: [
        {
          model: Service,
          as: 'service'
        },
        {
          model: Pet,
          as: 'pet'
        },
        {
          model: ServiceProvider,
          as: 'provider',
          required: false
        }
      ],
      order: [['scheduled_date', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        active_bookings: activeBookings
      }
    });
  } catch (error) {
    console.error('Get active tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;