const Logger = require('../helpers/Logger');
const rp = require('request-promise');

class ApiWriter {
    constructor(conf) {
        this.conf = conf;
    }

    start() {
    }

    send(pokemon) {
        const options = {
            method: 'POST',
            uri: this.conf.url,
            body: pokemon,
            json: true
        };

        rp(options).then(() => {
            Logger.debug('hook sent')
        }).catch((reason) => {
            Logger.error(`Error sending hook : ${reason}`)
        });
    }
}


module.exports = ApiWriter;