'use strict';

const Writer = require('../Writer');
const Logger = require('../helpers/Logger');
const Pokemon = require('../domain/Pokemon');

module.exports = class FakeListener {

    constructor(conf) {
        this.conf = conf;
    }

    start() {
        Logger.info('Starting fake listener');
        setInterval(() => this.generateMessage(), 5000);
    }

    getFakeName() {
        let names = this.conf.names;
        return names[Math.floor(Math.random() * names.length)];
    }

    generateMessage() {
        let pokemon = new Pokemon({
            source: "Fake",
            name: this.getFakeName(),
            iv: 100,
            lvl: 35,
            pc: 666,
            country: "fr"
        });

        //Logger.debug('Generated pokemon', {pokemon: pokemon});

        Writer.broadcast(pokemon);
    }
};