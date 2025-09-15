const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
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
    allowNull: false,
    references: {
      model: 'services',
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
  pet_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pets',
      key: 'id'
    }
  },
  booking_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  scheduled_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estimated_duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'assigned',
      'in_progress',
      'completed',
      'cancelled',
      'rescheduled'
    ),
    defaultValue: 'pending'
  },
  service_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    defaultValue: 'pending'
  },
  special_instructions: {
    type: DataTypes.TEXT
  },
  service_notes: {
    type: DataTypes.TEXT
  },
  cancellation_reason: {
    type: DataTypes.TEXT
  },
  started_at: {
    type: DataTypes.DATE
  },
  completed_at: {
    type: DataTypes.DATE
  },
  cancelled_at: {
    type: DataTypes.DATE
  },
  rescheduled_from: {
    type: DataTypes.DATE
  },
  provider_notes: {
    type: DataTypes.TEXT
  },
  customer_rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  customer_feedback: {
    type: DataTypes.TEXT
  },
  before_photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  after_photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  service_report: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  tracking_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  estimated_arrival: {
    type: DataTypes.DATE
  },
  actual_arrival: {
    type: DataTypes.DATE
  },
  provider_location: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'bookings',
  hooks: {
    beforeCreate: async (booking) => {
      if (!booking.booking_number) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        booking.booking_number = `PCP${timestamp}${random}`;
      }
    }
  }
});

module.exports = Booking;