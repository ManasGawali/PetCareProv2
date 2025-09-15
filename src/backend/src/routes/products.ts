import express, { Request, Response } from "express";
import { prisma } from "../utils/database";
import { optionalAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import Joi from "joi";
import { validateQuery } from "../utils/validation";

const router = express.Router();

// Query validation schema
const getProductsQuery = Joi.object({
  category: Joi.string()
    .valid(
      "FOOD",
      "ACCESSORIES",
      "TOYS",
      "HEALTH",
      "GROOMING_SUPPLIES",
    )
    .optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  search: Joi.string().min(1).max(100).optional(),
  inStock: Joi.boolean().optional(),
  sortBy: Joi.string()
    .valid("price", "name", "createdAt", "stock")
    .default("name"),
  sortOrder: Joi.string().valid("asc", "desc").default("asc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

// Get all products with filtering and pagination
router.get(
  "/",
  validateQuery(getProductsQuery),
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      inStock,
      sortBy,
      sortOrder,
      page,
      limit,
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

    if (inStock === true) {
      where.stock = { gt: 0 };
    } else if (inStock === false) {
      where.stock = 0;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
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
          imageUrl: true,
          stock: true,
          createdAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        products,
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
  }),
);

// Get product by ID
router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.active) {
      return res.status(404).json({
        success: false,
        message: "Product is not available",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  }),
);

// Get product categories with counts
router.get(
  "/categories/summary",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.product.groupBy({
      by: ["category"],
      where: { active: true },
      _count: {
        id: true,
      },
      _sum: {
        stock: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    const categoryData = categories.map((cat) => ({
      category: cat.category,
      count: cat._count.id,
      totalStock: cat._sum.stock || 0,
      displayName: getCategoryDisplayName(cat.category),
    }));

    res.json({
      success: true,
      data: { categories: categoryData },
    });
  }),
);

// Get featured products
router.get(
  "/featured/list",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // Get featured products (newest products with good stock)
    const featuredProducts = await prisma.product.findMany({
      where: {
        active: true,
        stock: { gt: 0 },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
      },
    });

    res.json({
      success: true,
      data: { products: featuredProducts },
    });
  }),
);

// Get related products (same category)
router.get(
  "/:id/related",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get the product to find its category
    const product = await prisma.product.findUnique({
      where: { id },
      select: { category: true, active: true },
    });

    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        active: true,
        stock: { gt: 0 },
        id: { not: id }, // Exclude current product
      },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
      },
    });

    res.json({
      success: true,
      data: { products: relatedProducts },
    });
  }),
);

// Search products
router.get(
  "/search/query",
  validateQuery(
    Joi.object({
      q: Joi.string().min(1).max(100).required(),
      category: Joi.string()
        .valid(
          "FOOD",
          "ACCESSORIES",
          "TOYS",
          "HEALTH",
          "GROOMING_SUPPLIES",
        )
        .optional(),
      limit: Joi.number().integer().min(1).max(20).default(10),
    }),
  ),
  optionalAuth,
  asyncHandler(async (req, res) => {
    const {
      q: searchQuery,
      category,
      limit,
    } = req.query as any;

    const where: any = {
      active: true,
      stock: { gt: 0 },
      OR: [
        {
          name: { contains: searchQuery, mode: "insensitive" },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    if (category) {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        imageUrl: true,
        stock: true,
      },
    });

    res.json({
      success: true,
      data: {
        products,
        query: searchQuery,
        count: products.length,
      },
    });
  }),
);

// Helper function to get display name for categories
function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    FOOD: "Pet Food",
    ACCESSORIES: "Accessories",
    TOYS: "Toys & Entertainment",
    HEALTH: "Health & Wellness",
    GROOMING_SUPPLIES: "Grooming Supplies",
  };

  return displayNames[category] || category;
}

export default router;