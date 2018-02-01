const rp = require('request-promise');
const Utils = require('./Utils');
const fs = require("fs");

const pokemondata = "https://github.com/PokemonGoF/PokemonGo-Web/raw/master/data/pokemondata.json";
const locale_fr = "https://github.com/PokemonGoF/PokemonGo-Bot/raw/master/data/locales/fr.json";

function consolidate(pokemons, locale) {
    // Generate by keys
    const pokedex = {};

    pokemons.forEach(pokemon => {
        pokemon.NameLocale = pokemon.Name;
        pokedex[Utils.normalize(pokemon.Name)] = pokemon;
    });

    // Add translation
    Object.keys(locale).forEach(name => {
        let pokemon = pokedex[Utils.normalize(name)];
        if (pokemon) {
            pokemon.NameLocale = locale[name];
            pokedex[Utils.normalize(locale[name])] = pokemon;
        }
    });

    return pokedex;
}

console.log("Loading datas...");
Promise.all([rp(pokemondata), rp(locale_fr)])
    .then(values => {
        console.log(" > done");
        let pokemons = JSON.parse(values[0]);
        let locale = JSON.parse(values[1]);

        console.log("Generating Pokedex...");
        let pokedex = consolidate(pokemons, locale);
        fs.writeFile('../data/pokedex.json', JSON.stringify(pokedex), 'utf8', () => console.log(" > done"));
    });