const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailLog = sequelize.define('EmailLog', {
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
  recipient_email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  recipient_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  body_preview: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'First 500 chars of email body'
  },
  email_status: {
    type: DataTypes.ENUM('sent', 'failed', 'bounced'),
    defaultValue: 'sent'
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional email metadata like attachments, cc, bcc'
  }
}, {
  tableName: 'email_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['contact_id'] },
    { fields: ['lead_id'] },
    { fields: ['sent_at'] },
    { fields: ['email_status'] }
  ]
});

module.exports = EmailLog;
