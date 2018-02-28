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
        this.rules = [];
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
        this.cache[file] = require(path.join(folder, file));
        this.buildRules();
    }

    buildRules() {
        this.rules = [].concat.apply([], Object.values(this.cache));
    }

    ruleIsValid(data) {
        if (!data) {
            return false;
        }

        if (!Array.isArray(data)) {
            Logger.warn(`Array expected as root`);
            return false;
        }

        return !data.some(data, (rule) => {
            // Looking for errors
            if (!Array.isArray(rule.destinations)) {
                Logger.warn(`Missing destinations array node`);
                return true;
            }
            if (!Array.isArray(rule.filters)) {
                Logger.warn(`Missing filters array node`);
                return true;
            } else {
                if (rule.filters.some(filter => {
                        if (filter.pokemons && !(filter.pokemons === '*' || Array.isArray(filter.pokemons))) {
                            Logger.warn(`Wrong format for node pokemons. * or Array expected`);
                            return false;
                        }
                    })) {
                    return false;
                }
            }
            return false;
        });
    }

    saveRule(prefix, json) {
        let file = `${prefix}.routes.json`;
        Logger.debug(`Saving ${file} routing file`);
        fs.writeFileSync(path.join(folder, file), json);
        this.cache[file] = JSON.parse(json);
        this.buildRules();
    }

    getRule(prefix) {
        let file = `${prefix}.routes.json`;
        Logger.debug(`Searching for ${file} routing file`);
        return this.cache[file];
    }

    getFiles() {
        return Object.keys(this.cache);
    }

    getRules() {
        return this.rules;
    }

    /**
     * Retrieve the list of rules of a writer
     *
     * @param writer
     * @returns {*[]}
     */
    getByWriter(writer) {
        return [].concat(...this.getRules().map(rule => rule.destinations)).filter(destination => {
            return (Array.isArray(destination.writer) ? destination.writer : [destination.writer]).indexOf(writer) > -1;
        });
    }
}

module.exports = new Router();