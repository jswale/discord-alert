//http://discordjs.readthedocs.io/en/latest/examples.html#logging-out
//https://discord.js.org/#/docs/main/stable/class/User

const MessageParser = require('./src/MessageParser');
const Writer = require('./src/Writer');
const Listener = require('./src/Listener');

MessageParser.init();
Writer.init();
Listener.init();
