
const Utils = require('../helpers/Utils');
const Logger = require('../helpers/Logger');

class SmsWriter {
    constructor(conf) {
        this.conf = conf;
    }

    start() {
    }

    buildMessage(pokemon) {
        let s;
        let entry = Utils.getPokedexEntry(pokemon);

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

    send(pokemon) {
        let url = this.conf.url.replace(/\{MESSAGE\}/, this.buildMessage(pokemon));
        rp(url).then(() => Logger.debug('SMS sent')).catch((reason) => Logger.error(`Error sending SMS : ${reason}`));
    }
}


module.exports = SmsWriter;