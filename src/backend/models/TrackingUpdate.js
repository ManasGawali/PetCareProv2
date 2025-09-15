const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrackingUpdate = sequelize.define('TrackingUpdate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  provider_id: {
    type: DataTypes.UUID,
    references: {
      model: 'service_providers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'assigned',
      'on_the_way',
      'arrived',
      'service_started',
      'service_in_progress',
      'service_completed',
      'departed',
      'cancelled'
    ),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  estimated_arrival: {
    type: DataTypes.DATE
  },
  estimated_completion: {
    type: DataTypes.DATE
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  is_milestone: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notification_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'tracking_updates',
  indexes: [
    {
      fields: ['booking_id', 'created_at']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_milestone']
    }
  ]
});

module.exports = TrackingUpdate;