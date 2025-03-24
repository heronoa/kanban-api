import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp(),
  format.printf(
    ({
      timestamp,
      level,
      message,
      errors,
    }: {
      timestamp: string;
      level: string;
      message: string;
      errors?: any[];
    }) => {
      return `${timestamp} [${level}]: ${message} ${
        errors ? JSON.stringify(errors, null, 2) : ''
      }`;
    },
  ),
);

const fileFormat = format.combine(
  format.timestamp(),
  format.printf(
    ({
      timestamp,
      level,
      message,
      errors,
    }: {
      timestamp: string;
      level: string;
      message: string;
      errors?: any[];
    }) => {
      return `${timestamp} [${level}]: ${message} ${
        errors ? JSON.stringify(errors, null, 2) : ''
      }`;
    },
  ),
);

export const errorLogger = createLogger({
  level: 'error',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
});

export const successLogger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-success.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
});
