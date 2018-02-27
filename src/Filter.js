'use strict';

const Logger = require('./helpers/Logger');
const Router = require('./Router');

const MODE_STRICT = 1;
const MODE_STARTS = 2;

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


function isInList(userFilter, pokemon, key, mode = MODE_STRICT) {
    let comparators = userFilter[key];
    if (!comparators) {
        return true;
    }
    let value = pokemon[key];
    return comparators.some(comparator => {
        switch(mode) {
            case MODE_STARTS:
                return value.startsWith(comparator);

            case MODE_STRICT:
            default:
                return comparator === value;
        }
    });
}

module.exports = {
    get: function (pokemon) {
        return Router.getRules().filter(rule => {
            return rule.filters.some(filter => {

                if (!isPokemonListed(filter.pokemons, pokemon.pokedexEntry)) {
                    //Logger.debug(`[filter] Pokemon is not watched`);
                    return false;
                }
                if (isPokemonExclude(filter.excludePokemons, pokemon.pokedexEntry)) {
                    //Logger.debug(`[filter] Pokemon is excluded`);
                    return false;
                }
                if (!checkCondition(filter, pokemon, 'lvl')) {
                    //Logger.debug(`[filter] Missmatch lvl`);
                    return false;
                }
                if (!checkCondition(filter, pokemon, 'iv')) {
                    //Logger.debug(`[filter] Missmatch iv`);
                    return false;
                }
                if (!checkCondition(filter, pokemon, 'pc')) {
                    //Logger.debug(`[filter] Missmatch pc`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'country')) {
                    //Logger.debug(`[filter] Missmatch country`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'channelId')) {
                    //Logger.debug(`[filter] Missmatch channelId`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'channelName')) {
                    //Logger.debug(`[filter] Missmatch channelName`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'guildId')) {
                    //Logger.debug(`[filter] Missmatch guildId`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'guildName')) {
                    //Logger.debug(`[filter] Missmatch guildName`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'city')) {
                    //Logger.debug(`[filter] Missmatch city`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'source')) {
                    //Logger.debug(`[filter] Missmatch source`);
                    return false;
                }
                if (!isInList(filter, pokemon, 'postalCode', MODE_STARTS)) {
                    //Logger.debug(`[filter] Missmatch postalCode`);
                    return false;
                }

                Logger.debug(` > Matching for ${pokemon.name} for ${rule.destinations[0].writer} > ${rule.destinations[0].group} > ${rule.destinations[0].name}`);

                return true;

            });
        });
    }
};
