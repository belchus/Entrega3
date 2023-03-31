const winston = require('winston')

function buildProdLogger() {
    const prodLogger = winston.createLogger(
        {
            transports: [
                new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
            ]
        }
    )
    return prodLogger
}

function buildDevLogger() {
    const devLogger = winston.createLogger(
        {
            transports: [
                new winston.transports.Console({ level: 'info' }),
                new winston.transports.Console({ level: 'warn' }),
                new winston.transports.Console({ level: 'error' }),
                new winston.transports.File({ filename: 'warn.log', level: 'warn' }),
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
            ]
        }
    )
    return devLogger
}

let logger = null

if(process.env.NODE_ENV === 'PROD') {
    logger = buildProdLogger()
} else {
    logger = buildDevLogger()
}

module.exports = logger