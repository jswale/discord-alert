'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('./helpers/Logger');
const config = require('./helpers/Config');
const DiscordListener = require('./listeners/DiscordListener');
const FakeListener = require('./listeners/FakeListener');

let folder = path.join(__dirname, `/../${config.get('path:listeners')}`);

class Listener {

    init() {
        if (!fs.existsSync(folder)) {
            Logger.info(`Creating folder ${folder}`);
            fs.mkdirSync(folder);
        }
        Logger.debug(`Looking for listeners files in ${folder}`);
        fs.readdirSync(folder).filter(file => file.endsWith('.listener.json')).forEach(file => {
            this.load(file);
        })
    }

    load(file) {
        Logger.debug(`  > Creating listener ${file}`);
        let conf = require(path.join(folder, file));
        let listener = this.create(conf);
        if (listener) {
            listener.start();
        }
        return listener;
    }

    create(conf) {
        switch (conf.type) {
            case "FAKE":
                return new FakeListener(conf.server);
            case "DISCORD":
            default:
                return new DiscordListener(conf.server, conf.guilds,  conf.channels);
        }
    }
}

module.exports = new Listener();