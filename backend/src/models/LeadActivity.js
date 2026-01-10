const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeadActivity = sequelize.define('LeadActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'leads',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  activity_type: {
    type: DataTypes.ENUM('call', 'email', 'whatsapp', 'meeting', 'note', 'status_change', 'stage_change'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  old_value: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  new_value: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'lead_activities',
  timestamps: false,
  underscored: true
});

module.exports = LeadActivity;
