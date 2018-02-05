'use strict';

const DiscordClient = require('./DiscordClient');
const MessageParser = require('../MessageParser');
const Logger = require('../helpers/Logger');

module.exports = class DiscordListener extends DiscordClient {

    constructor(conf, channels, writer) {
        super(conf);
        this.channels = channels;
        this.writer = writer;
    }

    onConnection() {
        // Listener
        this.client.on('message', (message) => {
            let channelId = message.channel.id;

            if (this.channels[channelId] === undefined) {
                // Ignore message
                return;
            }

            MessageParser.parse(message, this.channels[channelId]).then(pokemon => this.writer.send(pokemon)).catch(reason => Logger.warn(reason));
        });
    }
};