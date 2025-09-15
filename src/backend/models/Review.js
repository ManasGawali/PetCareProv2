const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  service_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  booking_id: {
    type: DataTypes.UUID,
    references: {
      model: 'bookings',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  order_id: {
    type: DataTypes.UUID,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  provider_id: {
    type: DataTypes.UUID,
    references: {
      model: 'service_providers',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 200]
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000]
    }
  },
  review_type: {
    type: DataTypes.ENUM('service', 'product', 'provider'),
    allowNull: false
  },
  is_verified_purchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  not_helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  response_from_business: {
    type: DataTypes.TEXT
  },
  response_date: {
    type: DataTypes.DATE
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  service_aspects: {
    type: DataTypes.JSON,
    defaultValue: {
      quality: null,
      punctuality: null,
      professionalism: null,
      value_for_money: null,
      communication: null
    }
  }
}, {
  tableName: 'reviews',
  indexes: [
    {
      fields: ['user_id', 'service_id']
    },
    {
      fields: ['user_id', 'product_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['is_approved']
    }
  ]
});

module.exports = Review;