import express from 'express';
import { prisma } from '../utils/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, schemas } from '../utils/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Get user addresses
router.get('/addresses', asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  res.json({
    success: true,
    data: { addresses },
  });
}));

// Create new address
router.post('/addresses', validateSchema(schemas.createAddress), asyncHandler(async (req, res) => {
  const { type, street, city, state, zipCode, country } = req.body;

  // If this is the first address, make it default
  const existingAddressCount = await prisma.address.count({
    where: { userId: req.user!.id },
  });

  const isDefault = existingAddressCount === 0;

  const address = await prisma.address.create({
    data: {
      userId: req.user!.id,
      type,
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: { address },
  });
}));

// Update address
router.put('/addresses/:id', validateSchema(schemas.createAddress), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, street, city, state, zipCode, country } = req.body;

  // Check if address exists and belongs to user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingAddress) {
    return res.status(404).json({
      success: false,
      message: 'Address not found',
    });
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: {
      type,
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
    },
  });

  res.json({
    success: true,
    message: 'Address updated successfully',
    data: { address: updatedAddress },
  });
}));

// Set default address
router.put('/addresses/:id/default', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if address exists and belongs to user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingAddress) {
    return res.status(404).json({
      success: false,
      message: 'Address not found',
    });
  }

  // Use transaction to update default addresses
  await prisma.$transaction([
    // Remove default from all user addresses
    prisma.address.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false },
    }),
    // Set this address as default
    prisma.address.update({
      where: { id },
      data: { isDefault: true },
    }),
  ]);

  res.json({
    success: true,
    message: 'Default address updated successfully',
  });
}));

// Delete address
router.delete('/addresses/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if address exists and belongs to user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingAddress) {
    return res.status(404).json({
      success: false,
      message: 'Address not found',
    });
  }

  const wasDefault = existingAddress.isDefault;

  await prisma.address.delete({
    where: { id },
  });

  // If deleted address was default, make another address default
  if (wasDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    });

    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  res.json({
    success: true,
    message: 'Address deleted successfully',
  });
}));

// Get user dashboard statistics
router.get('/dashboard', asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  // Get various statistics
  const [
    totalPets,
    totalBookings,
    upcomingBookings,
    completedBookings,
    totalSpent,
    cartItems,
    recentBookings
  ] = await Promise.all([
    // Total pets
    prisma.pet.count({ where: { userId } }),
    
    // Total bookings
    prisma.booking.count({ where: { userId } }),
    
    // Upcoming bookings
    prisma.booking.count({
      where: {
        userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledAt: { gte: new Date() },
      },
    }),
    
    // Completed bookings
    prisma.booking.count({
      where: { userId, status: 'COMPLETED' },
    }),
    
    // Total spent
    prisma.booking.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { totalPrice: true },
    }),
    
    // Cart items count
    prisma.cartItem.count({ where: { userId } }),
    
    // Recent bookings
    prisma.booking.findMany({
      where: { userId },
      include: {
        service: { select: { name: true, category: true } },
        pet: { select: { name: true, type: true } },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 5,
    }),
  ]);

  const dashboard = {
    totalPets,
    totalBookings,
    upcomingBookings,
    completedBookings,
    totalSpent: totalSpent._sum.totalPrice || 0,
    cartItems,
    recentBookings,
  };

  res.json({
    success: true,
    data: { dashboard },
  });
}));

// Get user activity (recent actions)
router.get('/activity', asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  // Get recent bookings and cart activities
  const [recentBookings, recentCartItems] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: {
        service: { select: { name: true } },
        pet: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    
    prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Format activities
  const activities = [
    ...recentBookings.map(booking => ({
      id: booking.id,
      type: 'booking',
      action: `Booked ${booking.service.name} for ${booking.pet.name}`,
      timestamp: booking.createdAt,
      status: booking.status,
    })),
    ...recentCartItems.map(item => ({
      id: item.id,
      type: 'cart',
      action: `Added ${item.product.name} to cart`,
      timestamp: item.createdAt,
      quantity: item.quantity,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 15);

  res.json({
    success: true,
    data: { activities },
  });
}));

export default router;