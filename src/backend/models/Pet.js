const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pet = sequelize.define('Pet', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  type: {
    type: DataTypes.ENUM('dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 100]
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 50
    }
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    validate: {
      min: 0
    }
  },
  weight_unit: {
    type: DataTypes.ENUM('kg', 'lbs'),
    defaultValue: 'kg'
  },
  size_category: {
    type: DataTypes.ENUM('small', 'medium', 'large', 'extra_large'),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown'
  },
  color: {
    type: DataTypes.STRING
  },
  microchip_id: {
    type: DataTypes.STRING
  },
  is_spayed_neutered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_vaccinated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  vaccination_date: {
    type: DataTypes.DATE
  },
  medical_conditions: {
    type: DataTypes.TEXT
  },
  allergies: {
    type: DataTypes.TEXT
  },
  medications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  dietary_restrictions: {
    type: DataTypes.TEXT
  },
  behavioral_notes: {
    type: DataTypes.TEXT
  },
  emergency_contact: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  veterinarian_info: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  photo_url: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  special_instructions: {
    type: DataTypes.TEXT
  },
  favorite_treats: {
    type: DataTypes.STRING
  },
  favorite_toys: {
    type: DataTypes.STRING
  },
  exercise_needs: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'very_high'),
    defaultValue: 'moderate'
  },
  socialization_level: {
    type: DataTypes.ENUM('shy', 'moderate', 'social', 'very_social'),
    defaultValue: 'moderate'
  }
}, {
  tableName: 'pets'
});

module.exports = Pet;