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

    connect(token, noTry = 1) {
        if (noTry == 5) {
            Logger.error(`Connexion attempt limit reached`);
            return;
        }
        Logger.debug(`Trying to connect using token ${token}, attempt ${noTry}`);
        this.client.login(token).then(() => {
            Logger.info(`Connected with ${token}`, {conf: this.conf});
        }).catch(reason => {
            Logger.error(`Unable to perform login with token ${token}`, {reason: reason});
            this.connect(token, noTry++);
        }).then(() => {
            this.connected = true;
            this.onConnection();
        }).catch((reason) => {
            Logger.error(`Error while performing onConnection with token ${token}`, {reason: reason});
            this.connect(token, noTry++);
        })
    }

    onConnection() {
    }
};