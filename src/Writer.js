'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('./helpers/Logger');
const config = require('./helpers/Config');
const DiscordWriter = require('./writers/DiscordWriter');
const SmsWriter = require('./writers/SmsWriter');
const ApiWriter = require('./writers/ApiWriter');
const PokeAlarmWriter = require('./writers/PokeAlarmWriter');
const ConsoleWriter = require('./writers/ConsoleWriter');
const Filter = require('./Filter');
const NodeCache = require("node-cache");

let folder = path.join(__dirname, `/../${config.get('path:writers')}`);

class Writer {
    constructor() {
        this.reset();
    }

    reset() {
        this.cache = new NodeCache({
            stdTTL: 30,
            checkperiod: 5
        });
        this.writers = {};
    }

    init() {
        this.reset();
        if (!fs.existsSync(folder)) {
            Logger.info(`Creating folder ${folder}`);
            fs.mkdirSync(folder);
        }
        Logger.debug(`Looking for writers files in ${folder}`);
        fs.readdirSync(folder).filter(file => file.endsWith('.writer.json')).forEach(file => {
            this.load(file);
        })
    }

    load(file) {
        Logger.debug(`  > Creating writer ${file}`);
        let conf = require(path.join(folder, file));
        let writer = this.create(conf);
        if (writer) {
            this.writers[conf.alias] = writer;
            writer.start();
        }
        return writer;
    }

    create(conf) {
        switch (conf.type) {
            case 'CONSOLE':
                return new ConsoleWriter();
            case 'SMS':
                return new SmsWriter(conf.server, conf.alias);
            case 'API':
                return new ApiWriter(conf.server, conf.alias);
            case 'PA':
                return new PokeAlarmWriter(conf.server, conf.alias);
            case 'DISCORD':
            default:
                return new DiscordWriter(conf.server, conf.alias);
        }
    }

    get(alias) {
        return this.writers[alias];
    }

    broadcast(pokemon) {
        Logger.debug(`[${pokemon.country}] ${pokemon.source} - ${pokemon.name} IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc}`);

        if (this.cache.get(pokemon.identifier)) {
            Logger.warn(`  > Duplicate entry detected`);
            return;
        } else {
            this.cache.set(pokemon.identifier, true);
        }

        Filter.get(pokemon).forEach(rule => {
            //Logger.debug(` > Found matching rule`, {rule:rule});
            rule.destinations.forEach(destination => {
                let list = Array.isArray(destination.writer) ? destination.writer : [destination.writer];
                list.forEach(key => {
                    let writer = this.writers[key];
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
}

module.exports = new Writer();