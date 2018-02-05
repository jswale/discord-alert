'use strict';

const rp = require('request-promise');

const Logger = require('./helpers/Logger');
const Utils = require('./helpers/Utils');
const DiscordWriter = require('./writers/DiscordWriter');
const SmsWriter = require('./writers/SmsWriter');
const config = require('./helpers/Config');


const writers = {};

function load(conf) {
    Logger.info(`Creating writer ${conf.alias}`);
    let writer = create(conf);
    if (null !== writer) {
        writers[conf.alias] = writer;
        writer.start();
    }
}

function create(conf) {
    switch (conf.type) {
        case 'SMS':
            return new SmsWriter(conf.server);
        case 'D':
            return new DiscordWriter(conf.server);
        default:
            return null;
    }
}

module.exports = {
    get : function(alias) {
        return writers[alias];
    },
    init: function () {
        config.get('writers').forEach(conf => load(conf));
    }
};