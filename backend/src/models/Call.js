const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Call = sequelize.define('Call', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contacts',
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
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  call_type: {
    type: DataTypes.ENUM('outgoing', 'incoming', 'missed'),
    defaultValue: 'outgoing'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  outcome: {
    type: DataTypes.ENUM('answered', 'no_answer', 'busy', 'voicemail'),
    allowNull: true
  },
  call_status: {
    type: DataTypes.ENUM('interested', 'not_interested', 'callback', 'converted', 'pending'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recording_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'call_recordings',
      key: 'id'
    }
  },
  recording_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Direct URL to Twilio recording'
  },
  twilio_call_sid: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Twilio Call SID for tracking'
  }
}, {
  tableName: 'calls',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Call;
