const Discord = require("discord.js");
const Tokenizer = require('./Tokenizer');

module.exports = class DiscordClient {

    constructor(conf) {
        this.conf = conf;
        this.connected = false;
        this.client = new Discord.Client();
    }

    start() {
        if (this.conf.token === undefined) {
            Tokenizer.get(this.conf.login, this.conf.password)
                .then(token => this.connect(token))
                .catch(reason => console.log(`Unable to retrieve token for ${this.conf.login}`));
        } else {
            this.connect(this.conf.token);
        }
    }

    connect(token) {
        console.log(`Trying to connect using token ${token}`);
        this.client.login(token).then(() => {
            console.log(`Connected with ${token}`);
            this.connected = true;
            this.onConnection();
        }).catch(reason => {
            console.log(`Unable to perform login with token ${token}`, reason)
        })
    }

    onConnection() {
    }
};