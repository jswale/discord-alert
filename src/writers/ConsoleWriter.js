const Logger = require('../helpers/Logger');

class ConsoleWriter {

    start() {
        //nothing to do
    }

    /**
     * Send the pokemon to the console
     *
     * @param pokemon the pokemon
     * @param destination the destination
     */
    send(pokemon, destination) {
        //283 / 333 / 311 / 351 / 276 / 331
        Logger.debug('Sending...', {pokemon: pokemon, destination: destination});
    }
}


module.exports = ConsoleWriter;