"use strict";
const Utils = require('../helpers/Utils');

class Pokemon {
    constructor(def) {
        this.source = def.source;
        this.name = def.name;
        this.iv = def.iv;
        this.lvl = def.lvl;
        this.pc = def.pc;
        this.boosted = def.boosted;
        this.template = def.template;
        this.despawn = def.despawn;
        this.country = def.country;
        this.location = def.location;
        this.city = def.city;
        this.postalCode = def.postalCode;
        this.lat = def.lat;
        this.lng = def.lng;
        this.url = def.url;

        this.pokedexEntry = Utils.getPokedexEntry(this);
    }
}

module.exports = Pokemon;
