const nconf = require('nconf');

function Config() {
    nconf.argv().env();
    nconf.file('default', './data/config.json');
}

Config.prototype.get = function(key) {
    return nconf.get(key);
};

module.exports = new Config();