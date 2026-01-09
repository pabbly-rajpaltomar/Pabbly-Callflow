const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const CallRecording = require('./CallRecording');
const Team = require('./Team');
const TeamMember = require('./TeamMember');

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

module.exports = {
  User,
  Contact,
  Call,
  CallRecording,
  Team,
  TeamMember
};
