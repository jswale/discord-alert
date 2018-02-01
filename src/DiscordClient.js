const Discord = require("discord.js");
const Tokenizer = require('./Tokenizer');

module.exports = class DiscordClient {

    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.client = new Discord.Client();
        this.connected = false;
    }

    start() {
        Tokenizer.get(this.email, this.password)
            .then(token => this.client.login(token).then(() => {
                this.connected = true;
                this.onConnection();
                console.log(`Connected with ${this.email}`);
            }));
    }

    onConnection() {
    }
};