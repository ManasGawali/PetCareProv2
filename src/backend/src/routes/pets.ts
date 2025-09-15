import express from 'express';
import { prisma } from '../utils/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, schemas } from '../utils/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// All pet routes require authentication
router.use(authenticateToken);

// Get all pets for the authenticated user
router.get('/', asyncHandler(async (req, res) => {
  const pets = await prisma.pet.findMany({
    where: { userId: req.user!.id },
    select: {
      id: true,
      name: true,
      type: true,
      breed: true,
      age: true,
      weight: true,
      photo: true,
      specialNotes: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: { pets },
  });
}));

// Get pet by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pet = await prisma.pet.findFirst({
    where: {
      id,
      userId: req.user!.id, // Ensure user owns this pet
    },
    select: {
      id: true,
      name: true,
      type: true,
      breed: true,
      age: true,
      weight: true,
      photo: true,
      specialNotes: true,
      createdAt: true,
      updatedAt: true,
      bookings: {
        select: {
          id: true,
          status: true,
          scheduledAt: true,
          service: {
            select: {
              name: true,
              category: true,
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5, // Recent bookings
      },
    },
  });

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found',
    });
  }

  res.json({
    success: true,
    data: { pet },
  });
}));

// Create new pet
router.post('/', validateSchema(schemas.createPet), asyncHandler(async (req, res) => {
  const { name, type, breed, age, weight, specialNotes } = req.body;

  const pet = await prisma.pet.create({
    data: {
      name,
      type,
      breed: breed || null,
      age: age || null,
      weight: weight || null,
      specialNotes: specialNotes || null,
      userId: req.user!.id,
    },
    select: {
      id: true,
      name: true,
      type: true,
      breed: true,
      age: true,
      weight: true,
      photo: true,
      specialNotes: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Pet added successfully',
    data: { pet },
  });
}));

// Update pet
router.put('/:id', validateSchema(schemas.createPet), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, type, breed, age, weight, specialNotes } = req.body;

  // Check if pet exists and belongs to user
  const existingPet = await prisma.pet.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingPet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found',
    });
  }

  const updatedPet = await prisma.pet.update({
    where: { id },
    data: {
      name,
      type,
      breed: breed || null,
      age: age || null,
      weight: weight || null,
      specialNotes: specialNotes || null,
    },
    select: {
      id: true,
      name: true,
      type: true,
      breed: true,
      age: true,
      weight: true,
      photo: true,
      specialNotes: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: 'Pet updated successfully',
    data: { pet: updatedPet },
  });
}));

// Delete pet
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if pet exists and belongs to user
  const existingPet = await prisma.pet.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
    include: {
      bookings: {
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
          },
        },
      },
    },
  });

  if (!existingPet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found',
    });
  }

  // Check if pet has active bookings
  if (existingPet.bookings.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete pet with active bookings. Please complete or cancel existing bookings first.',
    });
  }

  await prisma.pet.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Pet deleted successfully',
  });
}));

// Get pet statistics
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Verify pet ownership
  const pet = await prisma.pet.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found',
    });
  }

  // Get pet statistics
  const stats = await prisma.booking.groupBy({
    by: ['status'],
    where: { petId: id },
    _count: {
      id: true,
    },
  });

  const totalBookings = await prisma.booking.count({
    where: { petId: id },
  });

  const totalSpent = await prisma.booking.aggregate({
    where: {
      petId: id,
      status: 'COMPLETED',
    },
    _sum: {
      totalPrice: true,
    },
  });

  const recentServices = await prisma.booking.findMany({
    where: { petId: id },
    select: {
      service: {
        select: {
          name: true,
          category: true,
        },
      },
      scheduledAt: true,
      status: true,
    },
    orderBy: { scheduledAt: 'desc' },
    take: 5,
  });

  res.json({
    success: true,
    data: {
      stats: {
        totalBookings,
        totalSpent: totalSpent._sum.totalPrice || 0,
        statusBreakdown: stats,
        recentServices,
      },
    },
  });
}));

export default router;