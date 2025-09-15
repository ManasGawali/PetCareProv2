const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'grooming',
      'walking',
      'sitting',
      'training',
      'veterinary',
      'spa',
      'daycare',
      'boarding'
    ),
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 15
    }
  },
  image_url: {
    type: DataTypes.STRING
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  pet_types: {
    type: DataTypes.JSON,
    defaultValue: ['dog', 'cat']
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  pricing_tiers: {
    type: DataTypes.JSON,
    defaultValue: {
      small: { multiplier: 1.0, description: 'Small pets (up to 25 lbs)' },
      medium: { multiplier: 1.2, description: 'Medium pets (26-60 lbs)' },
      large: { multiplier: 1.5, description: 'Large pets (61+ lbs)' }
    }
  },
  average_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  booking_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  availability_schedule: {
    type: DataTypes.JSON,
    defaultValue: {
      monday: { start: '09:00', end: '18:00', available: true },
      tuesday: { start: '09:00', end: '18:00', available: true },
      wednesday: { start: '09:00', end: '18:00', available: true },
      thursday: { start: '09:00', end: '18:00', available: true },
      friday: { start: '09:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '17:00', available: true },
      sunday: { start: '10:00', end: '16:00', available: true }
    }
  }
}, {
  tableName: 'services'
});

module.exports = Service;