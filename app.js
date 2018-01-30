//http://discordjs.readthedocs.io/en/latest/examples.html#logging-out
//https://discord.js.org/#/docs/main/stable/class/User

const DiscordListener = require('./src/DiscordListener.js');
const DiscordWriter = require('./src/DiscordWriter.js');
const Config = require("./data/config.json");

const writers = {};
Config.writers.forEach(conf => {
    console.log(`Creating writer ${conf.alias}`);
    writers[conf.alias] = new DiscordWriter(conf.login, conf.password, conf.guild);
});

Config.listeners.forEach(conf => {
    console.log(`Creating listener with ${conf.login}`);
    new DiscordListener(conf.login, conf.password, conf.channels, writers[conf.writer]);
});
