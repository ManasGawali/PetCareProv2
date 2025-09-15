const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
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
  order_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned',
      'refunded'
    ),
    defaultValue: 'pending'
  },
  total_items: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  shipping_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
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
  payment_method: {
    type: DataTypes.ENUM('card', 'upi', 'wallet', 'cod', 'bank_transfer'),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  estimated_delivery: {
    type: DataTypes.DATE
  },
  actual_delivery: {
    type: DataTypes.DATE
  },
  shipped_at: {
    type: DataTypes.DATE
  },
  delivered_at: {
    type: DataTypes.DATE
  },
  cancelled_at: {
    type: DataTypes.DATE
  },
  cancellation_reason: {
    type: DataTypes.TEXT
  },
  tracking_number: {
    type: DataTypes.STRING
  },
  shipping_carrier: {
    type: DataTypes.STRING
  },
  delivery_instructions: {
    type: DataTypes.TEXT
  },
  order_notes: {
    type: DataTypes.TEXT
  },
  customer_notes: {
    type: DataTypes.TEXT
  },
  applied_coupons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  loyalty_points_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  loyalty_points_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'orders',
  hooks: {
    beforeCreate: async (order) => {
      if (!order.order_number) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        order.order_number = `ORD${timestamp}${random}`;
      }
    }
  }
});

module.exports = Order;