const rp = require('request-promise');
const Logger = require('../helpers/Logger');

class SmsWriter {

    constructor(conf, alias) {
        this.conf = conf;
        this.alias = alias;
    }

    start() {
        //nothing to do
    }

    /**
     * Send the pokemon to the SMS REST api
     *
     * @param pokemon the pokemon
     * @returns {Promise<any>}
     */
    send(pokemon) {
        let url = this.conf.url.replace('{MESSAGE}', SmsWriter.buildMessage(pokemon));
        return rp(url).then(() => Logger.debug('SMS sent')).catch((reason) => Logger.error(`Error sending SMS : ${reason}`));
    }

    static buildMessage(pokemon) {
        let s;
        let entry = pokemon.pokedexEntry;
        if (entry) {
            s = `[${entry.Number}] ${entry.NameLocale}`;
        } else {
            s = `${pokemon.name}`;
        }
        s += ` - IV ${pokemon.iv} - PC ${pokemon.pc} - LVL ${pokemon.lvl}`;
        if (null !== pokemon.url) {
            s += `\n${pokemon.url}`;
        }
        return s;
    }

}


module.exports = SmsWriter;