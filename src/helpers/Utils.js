'use strict';

const Logger = require('./Logger');
const Pokedex = require('../../data/pokedex.json');


function normalize(name) {
    return String(name ? name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '').toLowerCase() : '');
}

function getPokedexEntry(pokemon) {
    let normalized = normalize(pokemon.name);
    let entry = Pokedex[normalized];
    if (entry === undefined) {
        Logger.warn(`Unable to find pokemon with name ${pokemon.name}`);
    }
    return entry;
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

module.exports = {normalize, getPokedexEntry, getRangeInt, getRandomValue};
