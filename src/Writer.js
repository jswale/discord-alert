'use strict';

const Logger = require('./helpers/Logger');
const Utils = require('./helpers/Utils');
const DiscordWriter = require('./writers/DiscordWriter');
const SmsWriter = require('./writers/SmsWriter');
const ApiWriter = require('./writers/ApiWriter');
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
        case 'API':
            return new ApiWriter(conf.server);
        case 'D':
            return new DiscordWriter(conf.server);
        default:
            return null;
    }
}

function broadcast(pokemon) {
    Logger.debug(`[${pokemon.country}] ${pokemon.name} IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc}`);

    let entry = Utils.getPokedexEntry(pokemon);
    Filter.get(pokemon, entry).forEach(rule => {
        //Logger.debug(` > Found matching rule`, {rule:rule});
        rule.destinations.forEach(destination => {
            let list = Array.isArray(destination.writer) ? destination.writer : [destination.writer];
            list.forEach(key => {
                let writer = writers[key];
                if (writer) {
                    //Logger.debug(`Broadcast using writer ${key}`);
                    try {
                        writer.send(pokemon, entry, destination);
                    } catch (ex) {
                        Logger.error(`Error while sending message`, {
                            message: pokemon,
                            destination: destination,
                            exception: ex
                        });
                    }

                } else {
                    Logger.warn(`Unable to find writer ${key}`);
                }

            })
        })
    });
}


module.exports = {
    broadcast: broadcast,
    get: function (alias) {
        return writers[alias];
    },
    init: function () {
        Logger.info(`Loading writers`);
        config.get('writers').map(conf => load(conf));
        Logger.info(`> done`);
    }
};