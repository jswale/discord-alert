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

    getRandomValue(list, defaultValue) {
        return list ? (Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list) : defaultValue;
    }

    getRangeInt(prop, min, max) {
        if (prop) {
            if (Array.isArray(this.conf.iv)) {
                min = this.conf.iv[0];
                max = this.conf.iv[1];
            } else {
                return prop;
            }
        }
        return Math.floor(Math.random() * max) + min;
    }

    generateMessage() {
        let pokemon = new Pokemon({
            source: "Fake",
            name: this.getRandomValue(this.conf.names, "pikachu"),
            iv: this.getRangeInt(this.conf.iv, 1, 30),
            lvl: this.getRangeInt(this.conf.lvl, 1, 100),
            pc: this.getRangeInt(this.conf.pc, 10, 5000),
            country: this.getRandomValue(this.conf.country, 'fr')
        });

        //Logger.debug('Generated pokemon', {pokemon: pokemon});

        Writer.broadcast(pokemon);
    }
};