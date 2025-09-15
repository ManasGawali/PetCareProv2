const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, OrderItem, Cart, CartItem, Product, sequelize } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order from cart
// @access  Private
router.post('/', [
  auth,
  body('shipping_address').isObject().withMessage('Shipping address is required'),
  body('billing_address').isObject().withMessage('Billing address is required'),
  body('payment_method').isIn(['card', 'upi', 'wallet', 'cod', 'bank_transfer']).withMessage('Valid payment method is required')
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

    const {
      shipping_address,
      billing_address,
      payment_method,
      delivery_instructions,
      customer_notes
    } = req.body;

    // Get user's cart with items
    const cart = await Cart.findOne({
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
      ],
      transaction
    });

    if (!cart || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify stock availability for all items
    for (const item of cart.items) {
      if (item.product.stock_quantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock_quantity} available.`
        });
      }
    }

    // Calculate totals
    const subtotal = parseFloat(cart.total_amount);
    const tax_amount = subtotal * 0.18; // 18% GST
    const shipping_cost = subtotal >= 1000 ? 0 : 50; // Free shipping above ₹1000
    const total_amount = subtotal + tax_amount + shipping_cost;

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_items: cart.total_items,
      subtotal,
      tax_amount,
      shipping_cost,
      total_amount,
      payment_method,
      shipping_address,
      billing_address,
      delivery_instructions,
      customer_notes,
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }, { transaction });

    // Create order items and update stock
    for (const cartItem of cart.items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: cartItem.product_id,
        product_name: cartItem.product.name,
        product_sku: cartItem.product.sku,
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
        total_price: cartItem.total_price,
        variant_options: cartItem.variant_options,
        product_image: cartItem.product.images?.[0] || null
      }, { transaction });

      // Update product stock
      await cartItem.product.update({
        stock_quantity: cartItem.product.stock_quantity - cartItem.quantity
      }, { transaction });
    }

    // Clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction
    });

    await cart.update({
      total_items: 0,
      total_amount: 0.00
    }, { transaction });

    await transaction.commit();

    // Fetch complete order data
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
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

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: completeOrder }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { user_id: req.user.id };

    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        orders: orders.rows,
        pagination: {
          total: orders.count,
          pages: Math.ceil(orders.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: OrderItem,
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

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.put('/:id/cancel', [
  auth,
  body('cancellation_reason').notEmpty().withMessage('Cancellation reason is required')
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

    const { cancellation_reason } = req.body;

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    // Restore stock for all items
    for (const item of order.items) {
      await item.product.update({
        stock_quantity: item.product.stock_quantity + item.quantity
      }, { transaction });
    }

    // Update order status
    await order.update({
      status: 'cancelled',
      cancellation_reason,
      cancelled_at: new Date()
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/orders/recent/summary
// @desc    Get recent orders summary
// @access  Private
router.get('/recent/summary', auth, async (req, res) => {
  try {
    const recentOrders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          limit: 1
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: { orders: recentOrders }
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;