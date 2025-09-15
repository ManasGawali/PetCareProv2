const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_id: {
    type: DataTypes.UUID,
    references: {
      model: 'bookings',
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  payment_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING
  },
  payment_method: {
    type: DataTypes.ENUM('card', 'upi', 'wallet', 'bank_transfer', 'cod'),
    allowNull: false
  },
  payment_provider: {
    type: DataTypes.ENUM('stripe', 'razorpay', 'paytm', 'phonepe', 'googlepay'),
    allowNull: false
  },
  amount: {
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
  status: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'partially_refunded'
    ),
    defaultValue: 'pending'
  },
  payment_date: {
    type: DataTypes.DATE
  },
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  refund_date: {
    type: DataTypes.DATE
  },
  refund_reason: {
    type: DataTypes.TEXT
  },
  failure_reason: {
    type: DataTypes.TEXT
  },
  gateway_response: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'payments',
  hooks: {
    beforeCreate: async (payment) => {
      if (!payment.payment_id) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        payment.payment_id = `PAY${timestamp}${random}`;
      }
    }
  }
});

module.exports = Payment;