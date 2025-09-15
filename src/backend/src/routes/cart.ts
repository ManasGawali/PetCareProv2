import express, { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, schemas } from '../utils/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user!.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          price: true,
          imageUrl: true,
          stock: true,
          active: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Filter out inactive products or out of stock items
  const activeCartItems = cartItems.filter(item => 
    item.product.active && item.product.stock > 0
  );

  // Calculate totals
  const subtotal = activeCartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  const totalItems = activeCartItems.reduce((sum, item) => 
    sum + item.quantity, 0
  );

  // Estimate tax and delivery (simplified)
  const tax = subtotal * 0.18; // 18% GST in India
  const deliveryFee = subtotal > 1000 ? 0 : 50; // Free delivery above ₹1000
  const total = subtotal + tax + deliveryFee;

  res.json({
    success: true,
    data: {
      items: activeCartItems,
      summary: {
        totalItems,
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        deliveryFee,
        total: Math.round(total * 100) / 100,
      },
    },
  });
}));

// Add item to cart
router.post('/items', validateSchema(schemas.addToCart), asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  // Check if product exists and is available
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      active: true,
    },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  if (!product.active) {
    return res.status(400).json({
      success: false,
      message: 'Product is not available',
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} items available in stock`,
    });
  }

  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: req.user!.id,
        productId,
      },
    },
  });

  let cartItem;

  if (existingCartItem) {
    // Update quantity
    const newQuantity = existingCartItem.quantity + quantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${quantity} more items. Only ${product.stock - existingCartItem.quantity} additional items available`,
      });
    }

    if (newQuantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 items allowed per product',
      });
    }

    cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: req.user!.id,
          productId,
        },
      },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            imageUrl: true,
            stock: true,
          },
        },
      },
    });
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user!.id,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            imageUrl: true,
            stock: true,
          },
        },
      },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Item added to cart successfully',
    data: { cartItem },
  });
}));

// Update cart item quantity
router.put('/items/:productId', validateSchema(schemas.updateCartItem), asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  // Check if cart item exists
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: req.user!.id,
        productId,
      },
    },
    include: {
      product: {
        select: {
          stock: true,
          active: true,
        },
      },
    },
  });

  if (!existingCartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found',
    });
  }

  // If quantity is 0, remove item
  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: req.user!.id,
          productId,
        },
      },
    });

    return res.json({
      success: true,
      message: 'Item removed from cart',
    });
  }

  // Check stock availability
  if (quantity > existingCartItem.product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${existingCartItem.product.stock} items available in stock`,
    });
  }

  if (quantity > 10) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 10 items allowed per product',
    });
  }

  // Update quantity
  const updatedCartItem = await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId: req.user!.id,
        productId,
      },
    },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          imageUrl: true,
          stock: true,
        },
      },
    },
  });

  res.json({
    success: true,
    message: 'Cart item updated successfully',
    data: { cartItem: updatedCartItem },
  });
}));

// Remove item from cart
router.delete('/items/:productId', asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  // Check if cart item exists
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: req.user!.id,
        productId,
      },
    },
  });

  if (!existingCartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found',
    });
  }

  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId: req.user!.id,
        productId,
      },
    },
  });

  res.json({
    success: true,
    message: 'Item removed from cart successfully',
  });
}));

// Clear entire cart
router.delete('/clear', asyncHandler(async (req: Request, res: Response) => {
  const deletedCount = await prisma.cartItem.deleteMany({
    where: { userId: req.user!.id },
  });

  res.json({
    success: true,
    message: `Cart cleared successfully. ${deletedCount.count} items removed.`,
  });
}));

// Get cart summary (item count and total)
router.get('/summary', asyncHandler(async (req: Request, res: Response) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user!.id },
    include: {
      product: {
        select: {
          price: true,
          active: true,
          stock: true,
        },
      },
    },
  });

  // Filter active and in-stock items
  const activeItems = cartItems.filter(item => 
    item.product.active && item.product.stock > 0
  );

  const totalItems = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = activeItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  res.json({
    success: true,
    data: {
      totalItems,
      subtotal: Math.round(subtotal * 100) / 100,
      hasItems: totalItems > 0,
    },
  });
}));

export default router;