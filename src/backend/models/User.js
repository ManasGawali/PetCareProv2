const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  supabase_user_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for OAuth users
    validate: {
      len: [6, 100]
    }
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15]
    }
  },
  address: {
    type: DataTypes.TEXT
  },
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  zip_code: {
    type: DataTypes.STRING
  },
  avatar_url: {
    type: DataTypes.STRING
  },
  date_of_birth: {
    type: DataTypes.DATE
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: 'email',
    validate: {
      isIn: [['email', 'google']]
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      communication: {
        booking_updates: true,
        promotional: false,
        reminders: true
      }
    }
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  if (!this.password) {
    return false; // OAuth users don't have passwords
  }
  return bcrypt.compare(password, this.password);
};

// Instance method to get public profile
User.prototype.getPublicProfile = function() {
  const { password, ...publicProfile } = this.toJSON();
  return publicProfile;
};

module.exports = User;