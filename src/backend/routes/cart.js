const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cart, CartItem, Product, sequelize } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        total_items: 0,
        total_amount: 0.00
      });
      cart.items = [];
    }

    res.json({
      success: true,
      data: { cart }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [
  auth,
  body('product_id').isUUID().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { product_id, quantity, variant_options = {} } = req.body;

    // Check if product exists and is available
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_available) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock_quantity} items available in stock`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      transaction
    });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        total_items: 0,
        total_amount: 0.00
      }, { transaction });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: product_id
      },
      transaction
    });

    if (cartItem) {
      // Update existing item
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stock_quantity - cartItem.quantity} more available.`
        });
      }

      await cartItem.update({
        quantity: newQuantity,
        total_price: newQuantity * product.price
      }, { transaction });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: product_id,
        quantity: quantity,
        unit_price: product.price,
        total_price: quantity * product.price,
        variant_options
      }, { transaction });
    }

    // Update cart totals
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      transaction
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    await cart.update({
      total_items: totalItems,
      total_amount: totalAmount
    }, { transaction });

    await transaction.commit();

    // Fetch updated cart with products
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cart: updatedCart }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', [
  auth,
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
], async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id: req.params.itemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: req.user.id }
        },
        {
          model: Product,
          as: 'product'
        }
      ],
      transaction
    });

    if (!cartItem) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity === 0) {
      // Remove item from cart
      await cartItem.destroy({ transaction });
    } else {
      // Check stock availability
      if (cartItem.product.stock_quantity < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Only ${cartItem.product.stock_quantity} items available in stock`
        });
      }

      // Update item quantity
      await cartItem.update({
        quantity: quantity,
        total_price: quantity * cartItem.unit_price
      }, { transaction });
    }

    // Update cart totals
    const cartItems = await CartItem.findAll({
      where: { cart_id: cartItem.cart.id },
      transaction
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    await cartItem.cart.update({
      total_items: totalItems,
      total_amount: totalAmount
    }, { transaction });

    await transaction.commit();

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: { cart: updatedCart }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Find and remove cart item
    const cartItem = await CartItem.findOne({
      where: { id: req.params.itemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: req.user.id }
        }
      ],
      transaction
    });

    if (!cartItem) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy({ transaction });

    // Update cart totals
    const remainingItems = await CartItem.findAll({
      where: { cart_id: cartItem.cart.id },
      transaction
    });

    const totalItems = remainingItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = remainingItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    await cartItem.cart.update({
      total_items: totalItems,
      total_amount: totalAmount
    }, { transaction });

    await transaction.commit();

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: { cart: updatedCart }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      transaction
    });

    if (cart) {
      // Remove all cart items
      await CartItem.destroy({
        where: { cart_id: cart.id },
        transaction
      });

      // Reset cart totals
      await cart.update({
        total_items: 0,
        total_amount: 0.00
      }, { transaction });
    }

    await transaction.commit();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { 
        cart: {
          ...cart?.toJSON(),
          items: []
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/cart/count
// @desc    Get cart items count
// @access  Private
router.get('/count', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id }
    });

    const count = cart ? cart.total_items : 0;

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;