const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true // Allow null initially for guest users
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userType: {
    type: DataTypes.ENUM('visitor', 'guest_student', 'student', 'admin'),
    defaultValue: 'visitor'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phoneVerificationCode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  subjects: {
    type: DataTypes.JSON,
    allowNull: true
  },
  examFacingYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  trialStartDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trialEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to check password
User.prototype.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to check if trial is active
User.prototype.isTrialActive = function() {
  if (!this.trialStartDate || !this.trialEndDate) return false;
  const now = new Date();
  return now >= this.trialStartDate && now <= this.trialEndDate;
};

// Instance method to start trial
User.prototype.startTrial = function() {
  const now = new Date();
  this.trialStartDate = now;
  this.trialEndDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days from now
  this.userType = 'guest_student';
};

module.exports = User;