'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('./helpers/Logger');

const parsers = {};

module.exports = {
    register: function (alias, parser) {
        Logger.info(`Register parser ${alias}`);
        parsers[alias] = parser;
    },
    parse: function (message, alias) {
        return new Promise((resolve, error) => {
            let parser = parsers[alias];
            if (parser === undefined) {
                Logger.debug(`format#${message.id}`);
                resolve(`(${message.channel.name}): ${message.content.replace(/\n/g, ' ')}`);
            } else {
                parser.parse(message).then(pokemon => resolve(pokemon)).catch(reason => error(reason));
            }
        });
    },
    init: function () {
        Logger.info(`Loading parsers`);
        let basePath = path.resolve(__dirname, 'parsers');
        fs.readdirSync(basePath).forEach(file => {
            require(`./parsers/${file}`);
        });
        Logger.info(`> done`);
    }
};