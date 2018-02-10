'use strict';

const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

const myFormat = winston.format.printf(info => {
    let more = JSON.stringify(Object.assign({}, info, {
        timestamp: undefined,
        level: undefined,
        message: undefined,
        splat: undefined
    }));
    if(more === "{}") {
        more = '';
    } else {
        more = `- ${more}`;
    }
    return `[${info.timestamp}] ${info.level.toUpperCase()} - ${info.message} ${more}` ;
});

if (process.env.NODE_ENV !== 'production') {
    logger.level = 'debug';
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            myFormat
        )
    }));
}
module.exports = logger;
