"use strict";

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
        this.lat = def.lat;
        this.lng = def.lng;
        this.url = def.url;
    }
}

module.exports = Pokemon;
