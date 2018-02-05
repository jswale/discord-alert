'use strict';

const Discord = require('discord.js');
const Logger = require('../helpers/Logger');
const Tokenizer = require('../Tokenizer');

module.exports = class DiscordClient {

    constructor(conf) {
        this.conf = conf;
        this.connected = false;
    }

    start() {
        this.client = new Discord.Client();
        if (this.conf.token === undefined) {
            Tokenizer.get(this.conf.login, this.conf.password)
                .then(token => this.connect(token))
                .catch(reason => Logger.error(`Unable to retrieve token for ${this.conf.login}`));
        } else {
            this.connect(this.conf.token);
        }
    }

    connect(token) {
        Logger.debug(`Trying to connect using token ${token}`);
        this.client.login(token).then(() => {
            Logger.info(`Connected with ${token}`);
            this.connected = true;
            this.onConnection();
        }).catch(reason => {
            Logger.error(`Unable to perform login with token ${token}`, {reason: reason})
        })
    }

    onConnection() {
    }
};