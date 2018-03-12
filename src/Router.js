const fs = require('fs');
const path = require('path');
const config = require('./helpers/Config');
const Logger = require('./helpers/Logger');

let folder = path.join(__dirname, `/../${config.get('path:routes')}`);

class Router {

    constructor() {
        this.reset();
    }

    reset() {
        this.cache = {};
        this.datas = [];
    }

    init() {
        this.reset();
        if (!fs.existsSync(folder)) {
            Logger.info(`Creating folder ${folder}`);
            fs.mkdirSync(folder);
        }
        Logger.debug(`Looking for route files in ${folder}`);
        fs.readdirSync(folder).filter(file => file.endsWith('.route.json')).forEach(file => {
            this.load(file);
        })
    }

    load(file) {
        Logger.debug(` > Loading ${file} routing file`);
        this.cacheData(file, require(path.join(folder, file)));
    }

    cacheData(file, data) {
        this.cache[file] = data;
        this.datas = [].concat.apply([], Object.values(this.cache));
    }

    save(prefix, json) {
        let file = `${prefix}.routes.json`;
        Logger.debug(`Saving ${file} routing file`);
        fs.writeFileSync(path.join(folder, file), json);
        this.cacheData(file, JSON.parse(json));
    }

    getByName(prefix) {
        let file = `${prefix}.routes.json`;
        Logger.debug(`Searching for ${file} routing file`);
        return this.cache[file];
    }

    getFiles() {
        return Object.keys(this.cache);
    }

    getAll() {
        return this.datas;
    }

    /**
     * Retrieve the list of rules of a writer
     *
     * @param writer
     * @returns {*[]}
     */
    getByWriter(writer) {
        return [].concat(...this.getAll().map(rule => rule.destinations)).filter(destination => {
            return (Array.isArray(destination.writer) ? destination.writer : [destination.writer]).indexOf(writer) > -1;
        });
    }
}

module.exports = new Router();