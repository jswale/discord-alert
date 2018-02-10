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
        Logger.debug(`Loading ${file} routing rules`);
        this.cache[file] = require(`.${folder}/${file}`);
        this.rules = [].concat.apply([], Object.values(this.cache));
    }

    getRules() {
        return this.rules;
    }
}

module.exports = new Router();