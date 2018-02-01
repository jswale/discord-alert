const DiscordClient = require('./DiscordClient.js');
const MessageParser = require('./MessageParser');

module.exports = class DiscordListener extends DiscordClient {

    constructor(login, password, channels, writer) {
        super(login, password);
        this.channels = channels;
        this.writer = writer;
        this.start();
    }

    start() {
        // Listener
        this.client.on('message', (message) => {
            let channelId = message.channel.id;

            if (this.channels[channelId] === undefined) {
                // Ignore message
                return;
            }

            let pokemon = MessageParser.parse(message, this.channels[channelId]);
            if (null !== pokemon) {
                this.writer.send(pokemon);
            }
        });
    }
};