// Create database using node
const { Client } = require('pg');

async function createDatabase() {
  // First connect to postgres database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'pawartomar@0830',
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname='callflow_db'"
    );

    if (checkDb.rows.length === 0) {
      // Create database
      await client.query('CREATE DATABASE callflow_db');
      console.log('✓ Database callflow_db created successfully!');
    } else {
      console.log('✓ Database callflow_db already exists!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
