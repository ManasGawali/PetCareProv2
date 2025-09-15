const express = require('express');
const { body, validationResult } = require('express-validator');
const { Review, User, Service, Product, Booking, Order } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 1, max: 2000 }).withMessage('Comment is required and must be less than 2000 characters'),
  body('review_type').isIn(['service', 'product', 'provider']).withMessage('Valid review type is required')
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
      rating,
      comment,
      title,
      review_type,
      service_id,
      product_id,
      provider_id,
      booking_id,
      order_id,
      photos = [],
      service_aspects = {}
    } = req.body;

    // Validate that user has actually used the service/product
    let isVerifiedPurchase = false;

    if (review_type === 'service' && service_id) {
      if (booking_id) {
        const booking = await Booking.findOne({
          where: {
            id: booking_id,
            user_id: req.user.id,
            service_id,
            status: 'completed'
          }
        });
        isVerifiedPurchase = !!booking;
      }
    } else if (review_type === 'product' && product_id) {
      if (order_id) {
        const orderItem = await Order.findOne({
          where: {
            id: order_id,
            user_id: req.user.id,
            status: 'delivered'
          },
          include: [
            {
              model: OrderItem,
              as: 'items',
              where: { product_id }
            }
          ]
        });
        isVerifiedPurchase = !!orderItem;
      }
    }

    // Create review
    const review = await Review.create({
      user_id: req.user.id,
      service_id,
      product_id,
      provider_id,
      booking_id,
      order_id,
      rating,
      title,
      comment,
      review_type,
      is_verified_purchase: isVerifiedPurchase,
      photos,
      service_aspects
    });

    // Update average rating for the reviewed entity
    if (review_type === 'service' && service_id) {
      const service = await Service.findByPk(service_id);
      const reviews = await Review.findAll({
        where: { service_id, is_approved: true }
      });
      
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await service.update({
        average_rating: Math.round(avgRating * 100) / 100,
        total_reviews: reviews.length
      });
    } else if (review_type === 'product' && product_id) {
      const product = await Product.findByPk(product_id);
      const reviews = await Review.findAll({
        where: { product_id, is_approved: true }
      });
      
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await product.update({
        average_rating: Math.round(avgRating * 100) / 100,
        review_count: reviews.length
      });
    }

    // Load complete review data
    const completeReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['full_name', 'avatar_url']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review: completeReview }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews
// @desc    Get reviews with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      service_id,
      product_id,
      provider_id,
      review_type,
      rating,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_approved: true };

    // Apply filters
    if (service_id) whereClause.service_id = service_id;
    if (product_id) whereClause.product_id = product_id;
    if (provider_id) whereClause.provider_id = provider_id;
    if (review_type) whereClause.review_type = review_type;
    if (rating) whereClause.rating = rating;

    const reviews = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['full_name', 'avatar_url']
        }
      ],
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        reviews: reviews.rows,
        pagination: {
          total: reviews.count,
          pages: Math.ceil(reviews.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get user's reviews
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Service,
          as: 'service',
          required: false
        },
        {
          model: Product,
          as: 'product',
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
        reviews: reviews.rows,
        pagination: {
          total: reviews.count,
          pages: Math.ceil(reviews.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ min: 1, max: 2000 }).withMessage('Comment must be less than 2000 characters')
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

    const review = await Review.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const updates = req.body;
    await review.update(updates);

    // Recalculate average rating if rating was updated
    if (updates.rating) {
      if (review.service_id) {
        const service = await Service.findByPk(review.service_id);
        const reviews = await Review.findAll({
          where: { service_id: review.service_id, is_approved: true }
        });
        
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await service.update({
          average_rating: Math.round(avgRating * 100) / 100
        });
      } else if (review.product_id) {
        const product = await Product.findByPk(review.product_id);
        const reviews = await Review.findAll({
          where: { product_id: review.product_id, is_approved: true }
        });
        
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await product.update({
          average_rating: Math.round(avgRating * 100) / 100
        });
      }
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.destroy();

    // Recalculate average rating
    if (review.service_id) {
      const service = await Service.findByPk(review.service_id);
      const reviews = await Review.findAll({
        where: { service_id: review.service_id, is_approved: true }
      });
      
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await service.update({
          average_rating: Math.round(avgRating * 100) / 100,
          total_reviews: reviews.length
        });
      } else {
        await service.update({
          average_rating: 0,
          total_reviews: 0
        });
      }
    } else if (review.product_id) {
      const product = await Product.findByPk(review.product_id);
      const reviews = await Review.findAll({
        where: { product_id: review.product_id, is_approved: true }
      });
      
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await product.update({
          average_rating: Math.round(avgRating * 100) / 100,
          review_count: reviews.length
        });
      } else {
        await product.update({
          average_rating: 0,
          review_count: 0
        });
      }
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;