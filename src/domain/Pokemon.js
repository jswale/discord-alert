"use strict";

class Pokemon {
    constructor(source, name, iv, lvl, pc, boosted, template, despawn, country, location, url) {
        this.source = source;
        this.name = name;
        this.iv = parseInt(iv);
        this.lvl = parseInt(lvl);
        this.pc = parseInt(pc);
        this.boosted = boosted;
        this.template = template;
        this.despawn = despawn;
        this.country = country;
        this.location = location;
        this.url = url;
    }
}

module.exports = Pokemon;
