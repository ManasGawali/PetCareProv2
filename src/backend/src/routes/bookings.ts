import express from 'express';
import { prisma } from '../utils/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, schemas } from '../utils/validation';
import { asyncHandler } from '../middleware/errorHandler';
import Joi from 'joi';
import { validateQuery } from '../utils/validation';

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

// Query validation for getting bookings
const getBookingsQuery = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED').optional(),
  petId: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

// Get all bookings for the authenticated user
router.get('/', validateQuery(getBookingsQuery), asyncHandler(async (req, res) => {
  const { status, petId, startDate, endDate, page, limit } = req.query as any;

  // Build where clause
  const where: any = {
    userId: req.user!.id,
  };

  if (status) {
    where.status = status;
  }

  if (petId) {
    where.petId = petId;
  }

  if (startDate || endDate) {
    where.scheduledAt = {};
    if (startDate) where.scheduledAt.gte = new Date(startDate);
    if (endDate) where.scheduledAt.lte = new Date(endDate);
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get bookings with related data
  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            duration: true,
            imageUrl: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    },
  });
}));

// Get booking by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      userId: req.user!.id, // Ensure user owns this booking
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          price: true,
          duration: true,
          imageUrl: true,
        },
      },
      pet: {
        select: {
          id: true,
          name: true,
          type: true,
          breed: true,
          age: true,
          specialNotes: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  res.json({
    success: true,
    data: { booking },
  });
}));

// Create new booking
router.post('/', validateSchema(schemas.createBooking), asyncHandler(async (req, res) => {
  const { serviceId, petId, scheduledAt, notes, address, phone } = req.body;

  // Verify service exists and is active
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, name: true, price: true, active: true },
  });

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
    });
  }

  if (!service.active) {
    return res.status(400).json({
      success: false,
      message: 'Service is not currently available',
    });
  }

  // Verify pet exists and belongs to user
  const pet = await prisma.pet.findFirst({
    where: {
      id: petId,
      userId: req.user!.id,
    },
  });

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found',
    });
  }

  // Check for scheduling conflicts (optional: prevent double booking)
  const scheduledDate = new Date(scheduledAt);
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      userId: req.user!.id,
      scheduledAt: scheduledDate,
      status: {
        in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
      },
    },
  });

  if (conflictingBooking) {
    return res.status(400).json({
      success: false,
      message: 'You already have a booking scheduled at this time',
    });
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      userId: req.user!.id,
      serviceId,
      petId,
      scheduledAt: scheduledDate,
      totalPrice: service.price,
      notes: notes || null,
      address,
      phone,
      status: 'PENDING',
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          category: true,
          duration: true,
          imageUrl: true,
        },
      },
      pet: {
        select: {
          id: true,
          name: true,
          type: true,
          breed: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: { booking },
  });
}));

// Update booking status
router.put('/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  // Check if booking exists and belongs to user
  const existingBooking = await prisma.booking.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingBooking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Validate status transitions
  const currentStatus = existingBooking.status;
  const invalidTransitions = {
    COMPLETED: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
    CANCELLED: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
    REFUNDED: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
  };

  if (invalidTransitions[currentStatus]?.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot change status from ${currentStatus} to ${status}`,
    });
  }

  // Update booking
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      status,
      ...(status === 'COMPLETED' && { completedAt: new Date() }),
    },
    include: {
      service: {
        select: {
          name: true,
          category: true,
        },
      },
      pet: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });

  res.json({
    success: true,
    message: 'Booking status updated successfully',
    data: { booking: updatedBooking },
  });
}));

// Cancel booking
router.put('/:id/cancel', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check if booking can be cancelled
  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    return res.status(400).json({
      success: false,
      message: 'Booking cannot be cancelled in its current status',
    });
  }

  // Check cancellation policy (e.g., at least 24 hours before)
  const hoursUntilBooking = (booking.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilBooking < 24) {
    return res.status(400).json({
      success: false,
      message: 'Bookings can only be cancelled at least 24 hours in advance',
    });
  }

  const cancelledBooking = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      service: { select: { name: true } },
      pet: { select: { name: true } },
    },
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking: cancelledBooking },
  });
}));

// Get booking summary/statistics
router.get('/summary/stats', asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  // Get booking counts by status
  const statusCounts = await prisma.booking.groupBy({
    by: ['status'],
    where: { userId },
    _count: { id: true },
  });

  // Get total spent
  const totalSpent = await prisma.booking.aggregate({
    where: {
      userId,
      status: 'COMPLETED',
    },
    _sum: { totalPrice: true },
  });

  // Get upcoming bookings
  const upcomingBookings = await prisma.booking.count({
    where: {
      userId,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
      scheduledAt: {
        gte: new Date(),
      },
    },
  });

  // Get recent bookings
  const recentBookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      service: { select: { name: true, category: true } },
      pet: { select: { name: true } },
    },
    orderBy: { scheduledAt: 'desc' },
    take: 5,
  });

  const summary = {
    statusCounts: statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>),
    totalSpent: totalSpent._sum.totalPrice || 0,
    upcomingBookings,
    recentBookings,
  };

  res.json({
    success: true,
    data: { summary },
  });
}));

export default router;