"use strict";

let { createLogger, format, transports, addColors } = require("winston");
let path = require("path");
let fs = require("fs");
let mkdirp = require("mkdirp");

let config = require("../config");

// Create logs directory
let logDir = config.genralLogger.filesPath;


let Transports = [
    new transports.Console({
        colorize: true,
        prettyPrint: true,
        handleExceptions: config.app.environment === "production"
    })
];
if (config.genralLogger.filesLogger) {
    if (!fs.existsSync(logDir)) {
        mkdirp(logDir);
    }
    Transports.push(new transports.File({
        filename: path.join(logDir, "error.log"),
        level: 'error'
    }));
    Transports.push(new transports.File({
        filename: path.join(logDir, "combined.log"),
    }));
    const DailyRotateFile = require('winston-daily-rotate-file');
    Transports.push(new DailyRotateFile({
        filename: path.join(logDir, "combined.log"),
        level: config.genralLogger.level,
        json: config.genralLogger.json,
        timestamp: true,
        prettyPrint: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
    }));
}



const logger = createLogger({
    level: config.genralLogger.level,
    format: format.combine(
        // format(function dynamicContent(info, opts) {
        //   info.message = '[dynamic content] ' + info.message;
        //   return info;
        // })(),
        // format.label({ label: config.app.name }),
        format.errors({
            stack: true
        }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json(),
        // format.splat(),
    ),
    defaultMeta: {
        app: config.app.name,
        time: new Date()
    },
    transports: Transports
});

module.exports = logger;
