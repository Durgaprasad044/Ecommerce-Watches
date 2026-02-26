'use strict';

const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { supabaseAdmin } = require('./config/supabase');

let server;

const startServer = async () => {
  // Verify Supabase connection on startup
  try {
    const { error } = await supabaseAdmin.from('users').select('id').limit(1);
    if (error) throw error;
    logger.info('✅ Supabase connection verified.');
  } catch (err) {
    logger.error(`❌ Supabase connection failed: ${err.message}`);
    process.exit(1);
  }

  server = app.listen(env.PORT, () => {
    logger.info(`🚀 WatchVault API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  server.on('error', (err) => {
    logger.error(`Server error: ${err.message}`);
    process.exit(1);
  });
};

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server?.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force exit after 10 seconds if server hasn't closed
  setTimeout(() => {
    logger.warn('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  shutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  shutdown('uncaughtException');
});

startServer();
