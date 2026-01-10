const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeadAssignmentConfig = sequelize.define('LeadAssignmentConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  last_assigned_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignment_order: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of user IDs in rotation order'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'lead_assignment_config',
  timestamps: true,
  underscored: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = LeadAssignmentConfig;
