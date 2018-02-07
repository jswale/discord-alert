'use strict';

const Logger = require('./helpers/Logger');
const config = require('./helpers/Config');
const Writer = require('./Writer');
const DiscordListener = require('./domain/DiscordListener');


function load(conf) {
    Logger.info(`Creating listener`);
    let listener = create(conf);
    listener.start();
}

function create(conf) {
    return new DiscordListener(conf.server, conf.channels);
}

module.exports = {
    init: function () {
        config.get('listeners').forEach(conf => load(conf));
    }
};