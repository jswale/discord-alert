const nconf = require('nconf');

function Config() {
    nconf.argv().env();
    nconf.file('default', './data/config.json');
    nconf.defaults({
        path: {
            writers: "./data/writers",
            listeners: "./data/listeners",
            routes: "./data/routes"
        }
    });
}

Config.prototype.get = function (key) {
    return nconf.get(key);
};

module.exports = new Config();