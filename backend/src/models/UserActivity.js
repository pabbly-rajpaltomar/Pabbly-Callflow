const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserActivity = sequelize.define('UserActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  activity_type: {
    type: DataTypes.ENUM('login', 'logout', 'call_made', 'contact_created', 'lead_created'),
    allowNull: false
  },
  activity_timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional context about the activity'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'IPv4 or IPv6 address'
  }
}, {
  tableName: 'user_activity',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['activity_timestamp']
    },
    {
      fields: ['activity_type']
    }
  ]
});

module.exports = UserActivity;
