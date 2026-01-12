const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WhatsAppLog = sequelize.define('WhatsAppLog', {
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
    }
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id'
    }
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'leads',
      key: 'id'
    }
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  recipient_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  message_type: {
    type: DataTypes.ENUM('text', 'image', 'document', 'audio', 'video', 'template'),
    defaultValue: 'text'
  },
  message_preview: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'First 500 chars of message'
  },
  message_status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
    defaultValue: 'sent'
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'whatsapp_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['contact_id'] },
    { fields: ['lead_id'] },
    { fields: ['sent_at'] },
    { fields: ['message_status'] }
  ]
});

module.exports = WhatsAppLog;
