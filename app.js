//http://discordjs.readthedocs.io/en/latest/examples.html#logging-out
//https://discord.js.org/#/docs/main/stable/class/User

const MessageParser = require('./src/MessageParser');
const DiscordListener = require('./src/DiscordListener');
const Writer = require('./src/Writer');
const Logger = require('./src/helpers/Logger');
const config = require('./src/helpers/Config');

MessageParser.init();
Writer.init();

config.get("listeners").forEach(conf => {
    Logger.info(`Creating listener`);
    new DiscordListener(conf.server, conf.channels, Writer.get(conf.writer)).start();
});
