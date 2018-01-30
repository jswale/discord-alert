module.exports = class Pokemon {
    constructor(source, name, iv, lvl, pc, boosted, template, country, location, url) {
        this.source = source;
        this.name = name;
        this.iv = parseInt(iv);
        this.lvl = parseInt(lvl);
        this.pc = parseInt(pc);
        this.boosted = boosted;
        this.template = template;
        this.country = country;
        this.location = location;
        this.url = url;
    }
};