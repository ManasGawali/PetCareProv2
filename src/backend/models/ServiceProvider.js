const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServiceProvider = sequelize.define('ServiceProvider', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 15]
    }
  },
  bio: {
    type: DataTypes.TEXT
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  specializations: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: ['English']
  },
  service_areas: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  avatar_url: {
    type: DataTypes.STRING
  },
  background_check_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  insurance_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
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
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  completed_bookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(8, 2),
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
      sunday: { start: '10:00', end: '16:00', available: false }
    }
  },
  emergency_contact: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  travel_preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      max_distance_km: 25,
      transportation: 'car',
      willing_to_travel: true
    }
  }
}, {
  tableName: 'service_providers'
});

module.exports = ServiceProvider;