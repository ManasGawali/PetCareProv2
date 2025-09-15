import express, { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import Joi from 'joi';
import { validateQuery } from '../utils/validation';

const router = express.Router();

// Query validation schema
const getServicesQuery = Joi.object({
  category: Joi.string().valid('GROOMING', 'WALKING', 'SITTING', 'TRAINING', 'VETERINARY', 'BOARDING', 'BATH_SPA').optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  search: Joi.string().min(1).max(100).optional(),
  sortBy: Joi.string().valid('price', 'name', 'duration', 'createdAt').default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

// Get all services with filtering and pagination
router.get('/', validateQuery(getServicesQuery), optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
    page,
    limit
  } = req.query as any;

  // Build where clause
  const where: any = {
    active: true,
  };

  if (category) {
    where.category = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get services with pagination
  const [services, totalCount] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        duration: true,
        imageUrl: true,
        createdAt: true,
      },
    }),
    prisma.service.count({ where }),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json({
    success: true,
    data: {
      services,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    },
  });
}));

// Get service by ID
router.get('/:id', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      price: true,
      duration: true,
      imageUrl: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
    });
  }

  if (!service.active) {
    return res.status(404).json({
      success: false,
      message: 'Service is not available',
    });
  }

  res.json({
    success: true,
    data: { service },
  });
}));

// Get service categories with counts
router.get('/categories/summary', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.service.groupBy({
    by: ['category'],
    where: { active: true },
    _count: {
      id: true,
    },
    orderBy: {
      category: 'asc',
    },
  });

  const categoryData = categories.map(cat => ({
    category: cat.category,
    count: cat._count.id,
    displayName: getCategoryDisplayName(cat.category),
  }));

  res.json({
    success: true,
    data: { categories: categoryData },
  });
}));

// Get featured services (top rated or most popular)
router.get('/featured/list', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  // For now, get random featured services
  // In a real app, this would be based on ratings, popularity, etc.
  const featuredServices = await prisma.service.findMany({
    where: { active: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      price: true,
      duration: true,
      imageUrl: true,
    },
  });

  res.json({
    success: true,
    data: { services: featuredServices },
  });
}));

// Helper function to get display name for categories
function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    GROOMING: 'Grooming',
    WALKING: 'Dog Walking',
    SITTING: 'Pet Sitting',
    TRAINING: 'Training',
    VETERINARY: 'Veterinary',
    BOARDING: 'Pet Boarding',
    BATH_SPA: 'Bath & Spa',
  };

  return displayNames[category] || category;
}

export default router;