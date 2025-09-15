const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'food',
      'treats',
      'toys',
      'accessories',
      'health',
      'grooming',
      'beds',
      'carriers',
      'training',
      'supplements'
    ),
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING
  },
  brand: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 100]
    }
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    validate: {
      min: 0
    }
  },
  weight_unit: {
    type: DataTypes.ENUM('g', 'kg', 'oz', 'lbs'),
    defaultValue: 'kg'
  },
  dimensions: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  pet_types: {
    type: DataTypes.JSON,
    defaultValue: ['dog', 'cat']
  },
  pet_sizes: {
    type: DataTypes.JSON,
    defaultValue: ['small', 'medium', 'large']
  },
  age_range: {
    type: DataTypes.JSON,
    defaultValue: ['adult']
  },
  ingredients: {
    type: DataTypes.TEXT
  },
  nutritional_info: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  allergen_info: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  average_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  manufacturer_info: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  expiry_date: {
    type: DataTypes.DATE
  },
  storage_instructions: {
    type: DataTypes.TEXT
  },
  usage_instructions: {
    type: DataTypes.TEXT
  },
  return_policy: {
    type: DataTypes.TEXT
  },
  shipping_info: {
    type: DataTypes.JSON,
    defaultValue: {
      weight: 0,
      dimensions: {},
      fragile: false,
      special_handling: false
    }
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  promotion_end_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'products',
  hooks: {
    beforeCreate: async (product) => {
      if (!product.sku) {
        const timestamp = Date.now().toString().slice(-8);
        const category = product.category.substring(0, 3).toUpperCase();
        product.sku = `${category}${timestamp}`;
      }
    }
  }
});

module.exports = Product;