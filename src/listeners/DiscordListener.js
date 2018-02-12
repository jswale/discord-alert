'use strict';

const DiscordClient = require('../domain/DiscordClient');
const MessageParser = require('../MessageParser');
const Writer = require('../Writer');
const Logger = require('../helpers/Logger');

module.exports = class DiscordListener extends DiscordClient {

    constructor(conf, channels) {
        super(conf);
        this.channels = channels;
    }

    onConnection() {
        // Listener
        try {
            this.client.on('message', (message) => {
                let channelId = message.channel.id;

                if (this.channels[channelId] === undefined) {
                    // Ignore message
                    return;
                }
                try {
                    MessageParser.parse(message, this.channels[channelId]).then(pokemon => {
                        Writer.broadcast(pokemon);
                    }).catch(reason => {
                        Logger.warn(`Unable to parse message`, {reason: reason, message: message});
                    });
                } catch (ex) {
                    Logger.error(`Error while parsing message`, {message: message, exception: ex});
                }
            });
        } catch (ex) {
            Logger.error(`Error while reading message`, {message: message, exception: ex});
        }
    }
};