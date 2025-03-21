import { createLogger, transports, format } from 'winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(
    ({
      timestamp,
      level,
      message,
    }: {
      timestamp: string;
      level: string;
      message: string;
    }) => {
      return `${timestamp} [${level}]: ${message}`;
    },
  ),
);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export default logger;
