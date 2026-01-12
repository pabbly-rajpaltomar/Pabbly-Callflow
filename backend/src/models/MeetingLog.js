const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MeetingLog = sequelize.define('MeetingLog', {
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
  meeting_type: {
    type: DataTypes.ENUM('in_person', 'video_call', 'phone_call', 'site_visit'),
    defaultValue: 'video_call'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attendee_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  attendee_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  attendee_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  meeting_status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled'),
    defaultValue: 'scheduled'
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Physical address or meeting link'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  outcome: {
    type: DataTypes.ENUM('positive', 'negative', 'neutral', 'follow_up_needed', 'pending'),
    defaultValue: 'pending'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'meeting_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['contact_id'] },
    { fields: ['lead_id'] },
    { fields: ['scheduled_at'] },
    { fields: ['meeting_status'] }
  ]
});

module.exports = MeetingLog;
