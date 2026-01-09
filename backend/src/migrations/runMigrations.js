const { sequelize, testConnection } = require('../config/database');
const { User, Contact, Call, CallRecording, Team, TeamMember } = require('../models');

const runMigrations = async () => {
  try {
    console.log('Starting database migration...');

    await testConnection();

    await sequelize.sync({ force: false, alter: true });
    console.log('✓ Database tables created/updated successfully');

    const adminExists = await User.findOne({ where: { role: 'admin' } });

    if (!adminExists) {
      await User.create({
        email: 'admin@callflow.com',
        password_hash: 'admin123',
        full_name: 'System Administrator',
        role: 'admin',
        phone: '+1234567890'
      });
      console.log('✓ Default admin user created');
      console.log('  Email: admin@callflow.com');
      console.log('  Password: admin123');
    }

    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
