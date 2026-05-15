const winston = require("winston");
require('winston-daily-rotate-file');
const { combine, timestamp, printf, colorize, align } = winston.format;


const infoTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/others/%DATE%-others.log',
    datePattern: 'YYYY-MM-DD',
    level: "info",
    maxFiles: '14d',
});

const errorTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/error/%DATE%-error.log',
    datePattern: 'YYYY-MM-DD',
    level: "error",
    maxFiles: '14d',
});


// logger function
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `${info.timestamp} ${info.level} ${info.functionName} ${info.message} ${info.userId}`)
    ),
    transports: [
        infoTransport,
        errorTransport,
        new winston.transports.Console(),
    ],
});

module.exports = logger;
