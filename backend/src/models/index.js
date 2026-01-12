const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const CallRecording = require('./CallRecording');
const Team = require('./Team');
const TeamMember = require('./TeamMember');
const Lead = require('./Lead');
const WebhookLog = require('./WebhookLog');
const LeadAssignmentConfig = require('./LeadAssignmentConfig');
const UserActivity = require('./UserActivity');
const LeadActivity = require('./LeadActivity');
const EmailLog = require('./EmailLog');
const WhatsAppLog = require('./WhatsAppLog');
const MeetingLog = require('./MeetingLog');

// Define associations
User.hasMany(Contact, { foreignKey: 'assigned_to', as: 'assignedContacts' });
User.hasMany(Contact, { foreignKey: 'created_by', as: 'createdContacts' });
Contact.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
Contact.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Call, { foreignKey: 'user_id', as: 'calls' });
Call.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Contact.hasMany(Call, { foreignKey: 'contact_id', as: 'calls' });
Call.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

Call.hasOne(CallRecording, { foreignKey: 'call_id', as: 'recording' });
CallRecording.belongsTo(Call, { foreignKey: 'call_id', as: 'call' });

Team.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });
Team.belongsToMany(User, { through: TeamMember, foreignKey: 'team_id', as: 'members' });
User.belongsToMany(Team, { through: TeamMember, foreignKey: 'user_id', as: 'teams' });

// Lead associations
User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'assignedLeads' });
User.hasMany(Lead, { foreignKey: 'created_by', as: 'createdLeads' });
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
Lead.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Lead.belongsTo(Contact, { foreignKey: 'converted_to_contact_id', as: 'convertedContact' });
Contact.hasOne(Lead, { foreignKey: 'converted_to_contact_id', as: 'originLead' });

WebhookLog.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead.hasMany(WebhookLog, { foreignKey: 'lead_id', as: 'webhookLogs' });

// UserActivity associations
User.hasMany(UserActivity, { foreignKey: 'user_id', as: 'activities' });
UserActivity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// LeadActivity associations
Lead.hasMany(LeadActivity, { foreignKey: 'lead_id', as: 'activities' });
LeadActivity.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
User.hasMany(LeadActivity, { foreignKey: 'user_id', as: 'leadActivities' });
LeadActivity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// EmailLog associations
User.hasMany(EmailLog, { foreignKey: 'user_id', as: 'emailLogs' });
EmailLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Contact.hasMany(EmailLog, { foreignKey: 'contact_id', as: 'emailLogs' });
EmailLog.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
Lead.hasMany(EmailLog, { foreignKey: 'lead_id', as: 'emailLogs' });
EmailLog.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

// WhatsAppLog associations
User.hasMany(WhatsAppLog, { foreignKey: 'user_id', as: 'whatsappLogs' });
WhatsAppLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Contact.hasMany(WhatsAppLog, { foreignKey: 'contact_id', as: 'whatsappLogs' });
WhatsAppLog.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
Lead.hasMany(WhatsAppLog, { foreignKey: 'lead_id', as: 'whatsappLogs' });
WhatsAppLog.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

// MeetingLog associations
User.hasMany(MeetingLog, { foreignKey: 'user_id', as: 'meetingLogs' });
MeetingLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Contact.hasMany(MeetingLog, { foreignKey: 'contact_id', as: 'meetingLogs' });
MeetingLog.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
Lead.hasMany(MeetingLog, { foreignKey: 'lead_id', as: 'meetingLogs' });
MeetingLog.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

module.exports = {
  User,
  Contact,
  Call,
  CallRecording,
  Team,
  TeamMember,
  Lead,
  WebhookLog,
  LeadAssignmentConfig,
  UserActivity,
  LeadActivity,
  EmailLog,
  WhatsAppLog,
  MeetingLog
};
