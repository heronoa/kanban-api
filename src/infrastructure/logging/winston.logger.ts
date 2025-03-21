import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

// Formato colorido para o console
const consoleFormat = format.combine(
  format.colorize({ all: true }), // Aplica cor em toda a linha
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

// Formato sem cor para arquivos
const fileFormat = format.combine(
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

export const errorLogger = createLogger({
  level: 'error',
  transports: [
    new transports.Console({ format: consoleFormat }), // Cor no console
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat, // Sem cor no arquivo
    }),
  ],
});

export const successLogger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({ format: consoleFormat }), // Cor no console
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-success.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat, // Sem cor no arquivo
    }),
  ],
});
