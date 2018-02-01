function checkCondition(userFilter, pokemon, key) {
    const comparators = userFilter[key];
    const value = pokemon[key];

    // One value comparation
    if (typeof comparators === "number") {
        return value === comparators;
    }

    // No filter
    else if (comparators === undefined) {
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

    console.log("wrong comparator format. Expecting array[2] or number", comparators, key);
    return false;
}

function isPokemonListed(pokemons, pokemon) {
    if (Array.isArray(pokemons)) {
        return pokemons.indexOf(pokemon.id) > -1;
    } else {
        return pokemons === "*";
    }
}

function isInList(userFilter, pokemon, key) {
    const comparators = userFilter[key];
    const value = pokemon[key];
    if (comparators === undefined) {
        return true;
    }
    return comparators.indexOf(value) !== -1;
}

module.exports = {
    get: function (entry, users) {
        return Object.keys(users).filter(user => {
            //console.log(`\n--------------------\nChecking for ${user}`);
            return users[user]["filters"].some(filter => {
                if (!isPokemonListed(filter.pokemons, entry)) {
                    //console.debug("Missmatch pokemon", filter.pokemons, entry);
                    return false;
                }
                if (!checkCondition(filter, entry, 'lvl')) {
                    //console.debug("Missmatch lvl", filter.lvl, entry.lvl);
                    return false;
                }
                if (!checkCondition(filter, entry, 'iv')) {
                    //console.debug("Missmatch IV", filter.iv, entry.iv);
                    return false;
                }
                if (!checkCondition(filter, entry, 'pc')) {
                    //console.debug("Missmatch PC", filter.pc, entry.pc);
                    return false;
                }
                if (!isInList(filter, entry, 'country')) {
                    //console.debug("Missmatch country", filter.country, entry.country);
                    return false;
                }
                //console.log(`Found match for ${user}`);
                return true;
            });
        });
    }
};
