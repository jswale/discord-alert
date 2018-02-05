'use strict';

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

module.exports = {normalize, getPokedexEntry};
