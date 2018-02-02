//http://discordjs.readthedocs.io/en/latest/examples.html#logging-out
//https://discord.js.org/#/docs/main/stable/class/User

const DiscordListener = require('./src/DiscordListener');
const DiscordWriter = require('./src/DiscordWriter');
const Config = require("./data/config.json");

const writers = {};
Config.writers.forEach(conf => {
    console.log(`Creating writer ${conf.alias}`);
    let writer = new DiscordWriter(conf.server, conf.guild);
    writers[conf.alias] = writer;
    writer.start();
});

Config.listeners.forEach(conf => {
    console.log(`Creating listener with ${conf.login}`);
    new DiscordListener(conf.server, conf.channels, writers[conf.writer]).start();
});
