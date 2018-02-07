'use strict';

const rp = require('request-promise');

const Logger = require('./helpers/Logger');
const Utils = require('./helpers/Utils');
const DiscordWriter = require('./writers/DiscordWriter');
const SmsWriter = require('./writers/SmsWriter');
const Filter = require('./Filter');
const config = require('./helpers/Config');


const writers = {};

function load(conf) {
    Logger.info(`Creating writer ${conf.alias}`);
    let writer = create(conf);
    if (null !== writer) {
        writers[conf.alias] = writer;
        writer.start();
    }
    return writer;
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

function broadcast(pokemon) {
    Logger.debug(`[${pokemon.country}] IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc}`);

    let entry = Utils.getPokedexEntry(pokemon);
    Filter.get(pokemon, entry).forEach(rule => {
        rule.destinations.forEach(destination => {
            let writer = writers[destination.writer];
            if(writer) {
                Logger.debug(`Broadcast using writer ${destination.writer}`);
                writer.send(pokemon, entry, destination);
            } else {
                Logger.warn(`Unable to find writer ${destination.writer}`);
            }
        })
    });
}


module.exports = {
    broadcast : broadcast,
    get: function (alias) {
        return writers[alias];
    },
    init: function () {
        Logger.info(`Loading writers`);
        config.get('writers').map(conf => load(conf));
        Logger.info(`> done`);
    }
};