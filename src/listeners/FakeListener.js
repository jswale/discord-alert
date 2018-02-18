'use strict';

const Writer = require('../Writer');
const Utils = require('../helpers/Utils');
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

    generateMessage() {
        let pokemon = new Pokemon({
            source: "Fake",
            name: Utils.getRandomValue(this.conf.names, "pikachu"),
            iv: Utils.getRangeInt(this.conf.iv, 1, 30),
            lvl: Utils.getRangeInt(this.conf.lvl, 1, 100),
            pc: Utils.getRangeInt(this.conf.pc, 10, 5000),
            country: Utils.getRandomValue(this.conf.country, 'fr')
        });
        Writer.broadcast(pokemon);
    }
};