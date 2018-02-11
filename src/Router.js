const fs = require('fs');
const Logger = require('./helpers/Logger');

let folder = './data/routes';

class Router {

    constructor(){
        this.reset();
    }

    reset() {
        this.cache = {};
        this.rules = [];
    }

    init() {
        this.reset();
        if(!fs.existsSync(folder)) {
            Logger.debug(`Creating folder ${folder}`);
            fs.mkdirSync(folder);
        }
        Logger.debug(`Looking for ${folder} files`);
        fs.readdirSync(folder).forEach(file => {
            this.load(file);
        })
    }

    load(file) {
        Logger.debug(`Loading ${file} routing file`);
        this.cache[file] = require(`.${folder}/${file}`);
        this.buildRules();
    }

    buildRules() {
        this.rules = [].concat.apply([], Object.values(this.cache));
    }

    saveRule (prefix, json) {
        let file = `${prefix}.routes.json`;
        Logger.debug(`Saving ${file} routing file`);
        fs.writeFileSync(__dirname + `/.${folder}/${file}`, json);
        this.cache[file] = json;
        this.buildRules();
    }

    getRule(prefix) {
        let file = `${prefix}.routes.json`;
        Logger.debug(`Searching for ${file} routing file`);
        return this.cache[file];
    }

    getRules() {
        return this.rules;
    }
}

module.exports = new Router();