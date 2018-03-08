'use strict';

const Logger = require('./Logger');
const Pokedex = require('../../data/pokedex.json');


function normalize(name) {
    return String(name ? name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '').toLowerCase() : '');
}

function getPokedexEntry(pokemon) {
    let entry = getPokedexEntryByName(pokemon.name);
    if (entry === undefined) {
        Logger.warn(`Unable to find pokemon with name ${pokemon.name}`);
    }
    return entry;
}

function getPokedexEntryByName(name) {
    return Pokedex[normalize(name)];
}

function getPokedexEntryByNumber(number) {
    return Object.values(Pokedex).find(entry => entry.Number === number);
}

function getPokemonEvolutions(entry, current = false) {
    let evo = getPokedexEntryByNumber(entry.Number);
    let requirements = evo['Next Evolution Requirements'];
    return (current ? `__${evo.NameLocale}__` : evo.NameLocale) + (requirements ? ` (${requirements.Amount})` : '');
}

function getPokedexEntryDetail(entry) {
    let sheet = `**[${entry.Number}] ${entry.NameLocale}**`;
    sheet += `\n* **Type(s)**: ${Object.keys(entry).filter(key => key.startsWith('Type ')).map(type => entry[type]).join(', ')}`;
    sheet += `\n* **Fast Attack(s)**: ${entry["Fast Attack(s)"].join(', ')}`;
    sheet += `\n* **Special Attack(s)**: ${entry["Special Attack(s)"].join(', ')}`;
    sheet += `\n* **Attack**: ${entry.BaseAttack}`;
    sheet += `\n* **Defense**: ${entry.BaseDefense}`;
    sheet += `\n* **Stamina**: ${entry.BaseStamina}`;
    sheet += `\n* **Buddy distance**: ${entry.BuddyDistanceNeeded}km`;

    let evolutions = (entry['Previous evolution(s)'] || []).map(entry => getPokemonEvolutions(entry));
    evolutions.push(getPokemonEvolutions(entry, true));
    evolutions = evolutions.concat((entry['Next evolution(s)'] || []).map(entry => getPokemonEvolutions(entry)));
    sheet += `\n* **Evolution(s)**: ${evolutions.join(' > ')}`;

    return sheet;
}


function getRandomValue(list, defaultValue) {
    return list ? (Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list) : defaultValue;
}

function getRangeInt(prop, min, max) {
    if (prop) {
        if (Array.isArray(prop)) {
            switch(prop.length) {
                case 1:
                    return prop;
                case 2:
                    min = prop[0];
                    max = prop[1];
                    break;
                default :
                    Logger.warn('wrong arguments count');
            }
        } else {
            return prop;
        }
    }
    return Math.floor(Math.random() * max) + min;
}

function dateToMinute(date) {
    return date.split(':').map(v => parseInt(v, 10)).reverse().reduce((s, v, index) => s + v * Math.pow(60, index));
}

function dateFromNow(minutes) {
    var d = new Date();
    d.setMinutes(d.getMinutes() + minutes);
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

module.exports = {normalize, getPokedexEntry, getPokedexEntryDetail, getPokedexEntryByName, getPokedexEntryByNumber, getRangeInt, getRandomValue, dateToMinute, dateFromNow};
