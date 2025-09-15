const express = require('express');
const { Op } = require('sequelize');
const { Product, Review, User } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      pet_type,
      pet_size,
      brand,
      min_price,
      max_price,
      sort_by = 'name',
      sort_order = 'ASC',
      page = 1,
      limit = 12,
      search,
      featured
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { 
      is_available: true,
      stock_quantity: { [Op.gt]: 0 }
    };

    // Apply filters
    if (category) {
      whereClause.category = category;
    }

    if (pet_type) {
      whereClause.pet_types = {
        [Op.contains]: [pet_type]
      };
    }

    if (pet_size) {
      whereClause.pet_sizes = {
        [Op.contains]: [pet_size]
      };
    }

    if (brand) {
      whereClause.brand = { [Op.iLike]: `%${brand}%` };
    }

    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Op.gte] = min_price;
      if (max_price) whereClause.price[Op.lte] = max_price;
    }

    if (featured === 'true') {
      whereClause.is_featured = true;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const products = await Product.findAndCountAll({
      where: whereClause,
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get filter options
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { is_available: true }
    });

    const brands = await Product.findAll({
      attributes: ['brand'],
      group: ['brand'],
      where: { is_available: true, brand: { [Op.ne]: null } }
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          total: products.count,
          pages: Math.ceil(products.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        },
        filters: {
          categories: categories.map(c => c.category),
          brands: brands.map(b => b.brand)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
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
          where: { review_type: 'product' },
          order: [['created_at', 'DESC']],
          limit: 10,
          required: false
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.is_available) {
      return res.status(404).json({
        success: false,
        message: 'Product is currently unavailable'
      });
    }

    // Get related products
    const relatedProducts = await Product.findAll({
      where: {
        category: product.category,
        id: { [Op.ne]: product.id },
        is_available: true
      },
      limit: 4,
      order: [['average_rating', 'DESC']]
    });

    res.json({
      success: true,
      data: { 
        product,
        related_products: relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where: {
        category,
        is_available: true,
        stock_quantity: { [Op.gt]: 0 }
      },
      order: [['average_rating', 'DESC'], ['review_count', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          total: products.count,
          pages: Math.ceil(products.count / limit),
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/featured/list
// @desc    Get featured products
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        is_featured: true,
        is_available: true,
        stock_quantity: { [Op.gt]: 0 }
      },
      order: [
        ['average_rating', 'DESC'],
        ['review_count', 'DESC']
      ],
      limit: 8
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/bestsellers/list
// @desc    Get bestselling products
// @access  Public
router.get('/bestsellers/list', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        is_available: true,
        stock_quantity: { [Op.gt]: 0 },
        review_count: { [Op.gte]: 10 }
      },
      order: [
        ['review_count', 'DESC'],
        ['average_rating', 'DESC']
      ],
      limit: 6
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get bestselling products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/deals/list
// @desc    Get products on sale
// @access  Public
router.get('/deals/list', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        is_available: true,
        stock_quantity: { [Op.gt]: 0 },
        discount_percentage: { [Op.gt]: 0 },
        [Op.or]: [
          { promotion_end_date: null },
          { promotion_end_date: { [Op.gte]: new Date() } }
        ]
      },
      order: [
        ['discount_percentage', 'DESC'],
        ['average_rating', 'DESC']
      ],
      limit: 8
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get deal products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const suggestions = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { brand: { [Op.iLike]: `%${q}%` } },
          { category: { [Op.iLike]: `%${q}%` } }
        ],
        is_available: true
      },
      attributes: ['name', 'brand', 'category'],
      limit: 10
    });

    const uniqueSuggestions = Array.from(
      new Set([
        ...suggestions.map(p => p.name),
        ...suggestions.map(p => p.brand).filter(Boolean),
        ...suggestions.map(p => p.category)
      ])
    ).slice(0, 8);

    res.json({
      success: true,
      data: { suggestions: uniqueSuggestions }
    });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;