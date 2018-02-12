'use strict';

const Logger = require('./helpers/Logger');
const config = require('./helpers/Config');
const DiscordListener = require('./listeners/DiscordListener');
const FakeListener = require('./listeners/FakeListener');


function load(conf) {
    Logger.info(`Creating listener`);
    let listener = create(conf);
    if(listener) {
        listener.start();
    }
}

function create(conf) {
    switch (conf.type) {
        case "FAKE":
            return new FakeListener(conf.server);
        case "DISCORD":
        default:
            return new DiscordListener(conf.server, conf.channels);
    }
}

module.exports = {
    init: function () {
        config.get('listeners').forEach(conf => load(conf));
    }
};