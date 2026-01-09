const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CallRecording = sequelize.define('CallRecording', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  call_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'calls',
      key: 'id'
    }
  },
  file_path: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'File size in bytes'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Recording duration in seconds'
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'call_recordings',
  timestamps: false,
  underscored: true
});

module.exports = CallRecording;
