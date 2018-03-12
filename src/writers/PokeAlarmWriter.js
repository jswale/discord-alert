const Logger = require('../helpers/Logger');
const Utils = require('../helpers/Utils');
const rp = require('request-promise');

class PokeAlarmWriter {
    constructor(conf, alias) {
        this.conf = conf;
        this.alias = alias;
    }

    start() {
        //nothing to do
    }

    /**
     * Send the pokemon to the REST api
     *
     * @param pokemon the pokemon
     * @returns {Promise<any>}
     */
    send(pokemon) {
        const options = {
            method: 'POST',
            uri: this.conf.url,
            body: {
                type: "pokemon",
                message: Utils.toPokeAlarmFormat(pokemon)
            },
            json: true
        };

        return rp(options).then(() => {
            Logger.debug('   > Hook sent')
        }).catch((reason) => {
            Logger.error(`   > Error sending hook : ${reason}`)
        });
    }
}

module.exports = PokeAlarmWriter;