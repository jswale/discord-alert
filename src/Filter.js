'use strict';

const Logger = require('./helpers/Logger');
const Router = require('./Router');

function checkCondition(userFilter, pokemon, key) {
    const comparators = userFilter[key];
    const value = pokemon[key];

    // One value comparation
    if (typeof comparators === 'number') {
        return value === comparators;
    }

    // No filter
    else if (!comparators) {
        return true;
    }

    // Range
    else if (Array.isArray(comparators)) {
        switch (comparators.length) {
            case 1:
                return value === comparators[0];
            case 2 :
                return value >= comparators[0] && value <= comparators[1];
            default:
            // wrong fromat
        }
    }

    Logger.error('wrong comparator format. Expecting array[2] or number', {comparators: comparators, key: key});
    return false;
}

function isPokemonListed(pokemons, pokemon) {
    if (!pokemon) {
        return false;
    }
    if (Array.isArray(pokemons)) {
        return contains(pokemons, pokemon);
    } else {
        return pokemons === '*' || !pokemons;
    }
}

function contains(pokemons, pokemon) {
    return pokemons.indexOf(parseInt(pokemon.Number, 10)) > -1;
}

function isPokemonExclude(pokemons, pokemon) {
    if (!pokemon) {
        return true;
    }
    if (!pokemons) {
        return false;
    }
    if (Array.isArray(pokemons)) {
        return contains(pokemons, pokemon);
    } else {
        return pokemons === '*';
    }
}

function isInList(userFilter, pokemon, key) {
    const comparators = userFilter[key];
    const value = pokemon[key];
    if (!comparators) {
        return true;
    }
    return comparators.indexOf(value) !== -1;
}

module.exports = {
    get: function (entry, pokedex) {
        return Router.getRules().filter(rule => {
            return rule.filters.some(filter => {

                if (pokedex && !isPokemonListed(filter.pokemons, pokedex)) {
                    //Logger.debug(`[filter] Pokemon is not watched`);
                    return false;
                }
                if (pokedex && isPokemonExclude(filter.excludePokemons, pokedex)) {
                    //Logger.debug(`[filter] Pokemon is excluded`);
                    return false;
                }
                if (!checkCondition(filter, entry, 'lvl')) {
                    //Logger.debug(`[filter] Missmatch lvl`);
                    return false;
                }
                if (!checkCondition(filter, entry, 'iv')) {
                    //Logger.debug(`[filter] Missmatch iv`);
                    return false;
                }
                if (!checkCondition(filter, entry, 'pc')) {
                    //Logger.debug(`[filter] Missmatch pc`);
                    return false;
                }
                if (!isInList(filter, entry, 'country')) {
                    //Logger.debug(`[filter] Missmatch country`);
                    return false;
                }
                if (!isInList(filter, entry, 'city')) {
                    //Logger.debug(`[filter] Missmatch country`);
                    return false;
                }

                Logger.debug(` > Matching for ${entry.name} for ${rule.destinations[0].writer} > ${rule.destinations[0].group} > ${rule.destinations[0].name}`);

                return true;

            });
        });
    }
};
