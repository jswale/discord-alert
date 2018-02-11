//http://discordjs.readthedocs.io/en/latest/examples.html#logging-out
//https://discord.js.org/#/docs/main/stable/class/User

const MessageParser = require('./src/MessageParser');
const Writer = require('./src/Writer');
const Listener = require('./src/Listener');
const Router = require('./src/Router');
const WebServer = require('./src/WebServer');

try {
    Router.init();
    WebServer.init();
    MessageParser.init();
    Writer.init();
    Listener.init();
} catch(ex) {
    console.log('Error in app', ex);
}