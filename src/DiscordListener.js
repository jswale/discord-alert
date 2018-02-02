const DiscordClient = require('./DiscordClient.js');
const MessageParser = require('./MessageParser.js');

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

            //console.log("Receiving message", message.content);

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