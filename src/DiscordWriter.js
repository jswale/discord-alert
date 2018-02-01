const Discord = require("discord.js");
const DiscordClient = require('./DiscordClient.js');
const Utils = require('./Utils.js');
const Filter = require('./Filter.js');
const Pokedex = require('../data/pokedex.json');
const RoutingRules = require('../data/routes.json');

module.exports = class DiscordWriter extends DiscordClient {

    constructor(login, password, guildId) {
        super(login, password);
        this.guildId = guildId;
    }

    onConnection() {
        this.categories = {};
        this.getGuild().channels.forEach(channel => {
            if (channel.type === null) {
                this.categories[channel.name] = channel;
            }
        });

        // Send messages
        if (this.messages === undefined) {
            let message;
            while ((message = this.messages.pop())) {
                this.send(message);
            }
        }
    }

    send(pokemon) {
        //console.log("Sending message", message);
        if (false === this.connected) {
            if (this.messages === undefined) {
                this.messages = [];
            }
            this.messages.push(pokemon);
            return;
        }

        if (typeof pokemon === "string") {
            let channel = this.getChannelByParent("Divers", "vrac");
            channel.send(pokemon);
        } else {
            let message = this.buildMessage(pokemon);
            this.broadcast(pokemon, message);
        }
    }

    broadcast(pokemon, message) {
        console.log(`Any registred user for IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc} From ${pokemon.country}?`);
        let altChannels = Filter.get(pokemon, RoutingRules);
        altChannels.forEach(key => {
            let parent = RoutingRules[key]["group"];
            console.log("Send to " + key);

            let altChannel = this.getChannelByParent(parent, key);
            if (null !== altChannel) {
                altChannel.send(message);
            } else {
                console.warn(`No channel ${key} in category ${parent}`);
            }
        });
    }

    buildMessage(pokemon) {
        let embed = new Discord.RichEmbed();
        //embed.addField("IV", pokemon.iv, true);
        //embed.addField("Level", pokemon.lvl, true);
        embed.setTimestamp(new Date());

        if (pokemon.boosted === true) {
            embed.addField("Boost météo", "actif");
        }

        if(pokemon.template) {
            embed.setDescription(pokemon.template);
        }

        let normalized = Utils.normalize(pokemon.name);
        let entry = Pokedex[normalized];
        if (entry) {
            //console.log(`Found pokemon ${message.name}`, pokemon);
            embed.setAuthor(`[${entry.Number}] ${entry.NameLocale} - IV ${pokemon.iv} - PC ${pokemon.pc} - LVL ${pokemon.lvl}`, `https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`)
                .setThumbnail(`https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`)
        } else {
            console.log("Unable to find pokemon with name", normalized);
            embed.setAuthor(`${pokemon.name} - IV ${pokemon.iv} - PC ${pokemon.pc} - LVL ${pokemon.lvl}`);
        }

        let location = pokemon.location || "";
        if (null !== pokemon.url) {
            embed.setURL(pokemon.url);
            location += ("" !== location ? "\n\n" : "") + pokemon.url;
            let rx = /^.*(\d+\.\d+)(?:%2C|,)(\d+\.\d+)$/;
            let arr = rx.exec(pokemon.url);
            if (null !== arr) {
                embed.addField("GPS", `${arr[1]} | ${arr[2]}`);
            }
            embed.setTitle("Afficher sur la carte");
            embed.setURL(pokemon.url);
        }

        if ("" !== location) {
            embed.addField("Lieu", location);
        }

        if (pokemon.country !== "fr") {
            embed.addField("Pays", pokemon.country);
        }

        embed.setFooter(`Source: ${pokemon.source}`);
        return embed;
    }

    getChannelByParent(parent, name) {
        let parentChannel = this.categories[parent];
        if (!parentChannel) {
            return null;
        }
        return this.getGuild().channels.find(channel => {
            return channel.name === name && null !== channel.parentID && channel.parentID === parentChannel.id;
        });
    }

    getGuild() {
        if (!this.guild) {
            //this.client.guilds.forEach(guild=>console.log(`${guild.id} : ${guild.name}`));
            this.guild = this.client.guilds.find("id", this.guildId);
        }
        return this.guild;
    }
};