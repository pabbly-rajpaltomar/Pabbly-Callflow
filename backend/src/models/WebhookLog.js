const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebhookLog = sequelize.define('WebhookLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  endpoint: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  payload: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Full request body'
  },
  headers: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Request headers'
  },
  source_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'leads',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('success', 'failed', 'duplicate'),
    defaultValue: 'success'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'webhook_logs',
  timestamps: false
});

module.exports = WebhookLog;
