'use strict';

const Logger = require('./helpers/Logger');
const DiscordWriter = require('./writers/DiscordWriter');
const SmsWriter = require('./writers/SmsWriter');
const ApiWriter = require('./writers/ApiWriter');
const ConsoleWriter = require('./writers/ConsoleWriter');
const Filter = require('./Filter');
const config = require('./helpers/Config');


const writers = {};

/**
 *
 * @param conf
 * @param conf.alias
 * @return {*}
 */
function load(conf) {
    Logger.info(`  > Creating writer ${conf.alias}`);
    let writer = create(conf);
    if (writer) {
        writers[conf.alias] = writer;
        writer.start();
    }
    return writer;
}

function create(conf) {
    switch (conf.type) {
        case 'CONSOLE':
            return new ConsoleWriter();
        case 'SMS':
            return new SmsWriter(conf.server, conf.alias);
        case 'API':
            return new ApiWriter(conf.server, conf.alias);
        case 'DISCORD':
        default:
            return new DiscordWriter(conf.server, conf.alias);
    }
}

function broadcast(pokemon) {
    Logger.debug(`[${pokemon.country}] ${pokemon.source} - ${pokemon.name} IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc}`);

    Filter.get(pokemon).forEach(rule => {
        //Logger.debug(` > Found matching rule`, {rule:rule});
        rule.destinations.forEach(destination => {
            let list = Array.isArray(destination.writer) ? destination.writer : [destination.writer];
            list.forEach(key => {
                let writer = writers[key];
                if (writer) {
                    //Logger.debug(`Broadcast using writer ${key}`);
                    try {
                        writer.send(pokemon, destination);
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
    }
};