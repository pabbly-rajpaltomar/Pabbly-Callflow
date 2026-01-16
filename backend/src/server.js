const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const { sequelize, testConnection } = require('./config/database');

const authRoutes = require('./routes/auth');
const callRoutes = require('./routes/calls');
const contactRoutes = require('./routes/contacts');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const leadRoutes = require('./routes/leads');
const webhookRoutes = require('./routes/webhooks');
const emailRoutes = require('./routes/email');
const teamActivityRoutes = require('./routes/teamActivity');

const app = express();

app.use(helmet());

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow all origins in production for now
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CallFlow API Server',
    version: '1.0.0'
  });
});

// Health check endpoint for deployment
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/team-activity', teamActivityRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: config.nodeEnv === 'development' ? err : {}
  });
});

const startServer = async () => {
  try {
    await testConnection();

    await sequelize.sync({ alter: false });
    console.log('✓ Database models synchronized');

    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ API available at: http://localhost:${config.port}`);

      // Start automatic recording sync (every 5 minutes)
      const { startAutoSync } = require('./services/recordingSyncService');
      startAutoSync();
      console.log('✓ Automatic recording sync service started');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
