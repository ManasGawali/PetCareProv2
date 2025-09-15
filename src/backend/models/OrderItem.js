const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_sku: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  variant_options: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  product_image: {
    type: DataTypes.STRING
  },
  return_status: {
    type: DataTypes.ENUM('none', 'requested', 'approved', 'denied', 'completed'),
    defaultValue: 'none'
  },
  return_reason: {
    type: DataTypes.TEXT
  },
  return_requested_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'order_items',
  hooks: {
    beforeSave: (orderItem) => {
      orderItem.total_price = orderItem.quantity * orderItem.unit_price;
    }
  }
});

module.exports = OrderItem;