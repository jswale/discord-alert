const Logger = require('../helpers/Logger');

class ConsoleWriter {

    start() {
    }

    send(pokemon, entry, destination) {
        //283 / 333 / 311 / 351 / 276 / 331
        Logger.debug('Sending...', {pokemon: pokemon, destination: destination, entry: entry});
    }
}


module.exports = ConsoleWriter;