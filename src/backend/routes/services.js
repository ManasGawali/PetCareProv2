const express = require('express');
const { Op } = require('sequelize');
const { Service, Review, User } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      pet_type,
      min_price,
      max_price,
      sort_by = 'name',
      sort_order = 'ASC',
      page = 1,
      limit = 12,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_available: true };

    // Apply filters
    if (category) {
      whereClause.category = category;
    }

    if (pet_type) {
      whereClause.pet_types = {
        [Op.contains]: [pet_type]
      };
    }

    if (min_price || max_price) {
      whereClause.base_price = {};
      if (min_price) whereClause.base_price[Op.gte] = min_price;
      if (max_price) whereClause.base_price[Op.lte] = max_price;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const services = await Service.findAndCountAll({
      where: whereClause,
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: ['rating', 'comment'],
          limit: 3,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    // Get service categories for filtering
    const categories = await Service.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { is_available: true }
    });

    res.json({
      success: true,
      data: {
        services: services.rows,
        pagination: {
          total: services.count,
          pages: Math.ceil(services.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        },
        filters: {
          categories: categories.map(c => c.category)
        }
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['full_name', 'avatar_url']
            }
          ],
          order: [['created_at', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.is_available) {
      return res.status(404).json({
        success: false,
        message: 'Service is currently unavailable'
      });
    }

    res.json({
      success: true,
      data: { service }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const services = await Service.findAndCountAll({
      where: {
        category,
        is_available: true
      },
      order: [['average_rating', 'DESC'], ['booking_count', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        services: services.rows,
        pagination: {
          total: services.count,
          pages: Math.ceil(services.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: {
        is_available: true,
        average_rating: { [Op.gte]: 4.0 }
      },
      order: [
        ['average_rating', 'DESC'],
        ['booking_count', 'DESC']
      ],
      limit: 8
    });

    res.json({
      success: true,
      data: { services }
    });
  } catch (error) {
    console.error('Get featured services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/popular
// @desc    Get popular services
// @access  Public
router.get('/popular/list', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: {
        is_available: true
      },
      order: [
        ['booking_count', 'DESC'],
        ['average_rating', 'DESC']
      ],
      limit: 6
    });

    res.json({
      success: true,
      data: { services }
    });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;