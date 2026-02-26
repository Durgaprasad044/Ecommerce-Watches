'use strict';

const winston = require('winston');
const path = require('path');
const env = require('../config/env');

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) =>
    stack ? `[${ts}] ${level}: ${message}\n${stack}` : `[${ts}] ${level}: ${message}`
  )
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: env.isProd() ? prodFormat : devFormat,
    silent: env.NODE_ENV === 'test',
  }),
];

if (env.isProd()) {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: prodFormat,
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: prodFormat,
    })
  );
}

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
  exitOnError: false,
});

module.exports = logger;
