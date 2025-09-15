const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { Booking, Service, Pet, User, ServiceProvider, TrackingUpdate } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [
  auth,
  body('service_id').isInt().withMessage('Service ID is required'),
  body('pet_id').isUUID().withMessage('Pet ID is required'),
  body('scheduled_date').isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduled_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('service_address').isObject().withMessage('Service address is required')
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

    const {
      service_id,
      pet_id,
      scheduled_date,
      scheduled_time,
      service_address,
      special_instructions
    } = req.body;

    // Verify service exists and is available
    const service = await Service.findByPk(service_id);
    if (!service || !service.is_available) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or unavailable'
      });
    }

    // Verify pet belongs to user
    const pet = await Pet.findOne({
      where: {
        id: pet_id,
        user_id: req.user.id,
        is_active: true
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or does not belong to you'
      });
    }

    // Calculate total amount based on pet size
    const sizeMultiplier = service.pricing_tiers[pet.size_category]?.multiplier || 1.0;
    const total_amount = service.base_price * sizeMultiplier;

    // Create booking
    const booking = await Booking.create({
      user_id: req.user.id,
      service_id,
      pet_id,
      scheduled_date,
      scheduled_time,
      estimated_duration: service.duration_minutes,
      service_address,
      total_amount,
      special_instructions,
      status: 'pending'
    });

    // Load complete booking data
    const completeBooking = await Booking.findByPk(booking.id, {
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
          model: User,
          as: 'customer',
          attributes: ['full_name', 'email', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: completeBooking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sort_by = 'scheduled_date',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { user_id: req.user.id };

    if (status) {
      whereClause.status = status;
    }

    const bookings = await Booking.findAndCountAll({
      where: whereClause,
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
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        bookings: bookings.rows,
        pagination: {
          total: bookings.count,
          pages: Math.ceil(bookings.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
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

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', [
  auth,
  body('cancellation_reason').notEmpty().withMessage('Cancellation reason is required')
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

    const { cancellation_reason } = req.body;

    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking in current status'
      });
    }

    await booking.update({
      status: 'cancelled',
      cancellation_reason,
      cancelled_at: new Date()
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id/reschedule
// @desc    Reschedule a booking
// @access  Private
router.put('/:id/reschedule', [
  auth,
  body('new_date').isISO8601().withMessage('Valid new date is required'),
  body('new_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required')
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

    const { new_date, new_time } = req.body;

    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule booking in current status'
      });
    }

    const originalDate = booking.scheduled_date;

    await booking.update({
      scheduled_date: new_date,
      scheduled_time: new_time,
      status: 'rescheduled',
      rescheduled_from: originalDate
    });

    res.json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Reschedule booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bookings/:id/review
// @desc    Add review for completed booking
// @access  Private
router.post('/:id/review', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 1, max: 2000 }).withMessage('Comment is required and must be less than 2000 characters')
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

    const { rating, comment, title } = req.body;

    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        status: 'completed'
      },
      include: [
        {
          model: Service,
          as: 'service'
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Completed booking not found'
      });
    }

    // Update booking with review
    await booking.update({
      customer_rating: rating,
      customer_feedback: comment
    });

    res.json({
      success: true,
      message: 'Review added successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/upcoming/summary
// @desc    Get upcoming bookings summary
// @access  Private
router.get('/upcoming/summary', auth, async (req, res) => {
  try {
    const upcomingBookings = await Booking.findAll({
      where: {
        user_id: req.user.id,
        status: ['confirmed', 'assigned'],
        scheduled_date: {
          [Op.gte]: new Date()
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
        }
      ],
      order: [['scheduled_date', 'ASC']],
      limit: 5
    });

    res.json({
      success: true,
      data: { bookings: upcomingBookings }
    });
  } catch (error) {
    console.error('Get upcoming bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;