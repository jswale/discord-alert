'use strict';

const DiscordClient = require('../domain/DiscordClient');
const MessageParser = require('../MessageParser');
const Writer = require('../Writer');
const Logger = require('../helpers/Logger');

module.exports = class DiscordListener extends DiscordClient {

    constructor(conf, guilds={}, channels={}) {
        super(conf);
        this.guilds = guilds;
        this.channels = channels;
    }

    onConnection() {
        // Listener
        this.client.on('message', (message) => {
            let channelId = message.channel.id;
            let guildId = message.channel.guild.id;

            let format;
            if (this.guilds[guildId]) {
                format = this.guilds[guildId];
            } else {
                format = this.channels[channelId];
            }
            if(!format) {
                // ignore message
                return;
            }

            try {
                MessageParser.parse(message, format).then(pokemon => {
                    Writer.broadcast(pokemon);
                }).catch(reason => {
                    Logger.warn(`Unable to parse message`, {reason: reason, message: message});
                });
            } catch (ex) {
                Logger.error(`Error while parsing message`, {message: message, exception: ex});
            }
        });
    }
};