const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'callflow_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

async function addRecordingColumn() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected!');

    console.log('📝 Adding recording_url column...');
    await sequelize.query('ALTER TABLE calls ADD COLUMN IF NOT EXISTS recording_url TEXT;');
    console.log('✅ Column added successfully!');

    console.log('📊 Creating index...');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_calls_recording_url ON calls(recording_url);');
    console.log('✅ Index created!');

    console.log('🎉 Database migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addRecordingColumn();
