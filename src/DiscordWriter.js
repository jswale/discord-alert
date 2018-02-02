const Discord = require("discord.js");
const DiscordClient = require('./DiscordClient');
const Utils = require('./Utils');
const Filter = require('./Filter');
const Pokedex = require('../data/pokedex.json');
const RoutingRules = require('../data/routes.json');

module.exports = class DiscordWriter extends DiscordClient {

    constructor(conf, guildId) {
        super(conf);
        this.guildId = guildId;
    }

    onConnection() {
        this.categories = {};
        this.channelsCache = {};
        this.getGuild().channels.forEach(channel => {
            if (channel.type === null) {
                this.categories[channel.name] = channel;
            }
        });

        // Send messages
        if (this.messages !== undefined) {
            let message;
            while ((message = this.messages.pop())) {
                this.send(message);
            }
        }
    }


    getGuild() {
        if (this.guild === undefined) {
            //this.client.guilds.forEach(guild=>console.log(`${guild.id} : ${guild.name}`));
            this.guild = this.client.guilds.find("id", this.guildId);
        }
        return this.guild;
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
            this.getOrCreateChannel("Divers", "vrac").then(channel => channel.send(pokemon));
        } else {
            this.broadcast(pokemon);
        }
    }

    broadcast(pokemon) {
        console.log(`[${pokemon.country}] IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc}`);

        let normalized = Utils.normalize(pokemon.name);
        let entry = Pokedex[normalized];
        if(entry === undefined) {
            console.log(`Unable to find pokemon with name ${pokemon.name}`);
        }

        let altChannels = Filter.get(pokemon, entry, RoutingRules);
        altChannels.forEach(key => {
            console.log("Broadcast to " + key);
            this.getOrCreateChannel(RoutingRules[key]["group"], key).then(channel => {
                channel.send(this.buildMessage(pokemon, entry, RoutingRules[key]["mentions"] || []));
            });
        });
    }

    getDescription(pokemon, entry) {
        let s;
        if(entry) {
            s = `[${entry.Number}] ${entry.NameLocale}`;
        } else {
            s = `${pokemon.name}`;
        }

        s += ` - IV ${pokemon.iv} - PC ${pokemon.pc} - LVL ${pokemon.lvl}`;
        if (pokemon.template) {
            s += `\n${pokemon.template}`;
        }
        return s;
    }

    buildMessage(pokemon, entry, mentions) {
        let embed = new Discord.RichEmbed();
        //embed.addField("IV", pokemon.iv, true);
        //embed.addField("Level", pokemon.lvl, true);
        embed.setTimestamp(new Date());

        if (entry) {
            //console.log(`Found pokemon ${message.name}`, pokemon);
//            embed.setAuthor(`[${entry.Number}] ${entry.NameLocale} - IV ${pokemon.iv} - PC ${pokemon.pc} - LVL ${pokemon.lvl}`, `https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
            embed.setThumbnail(`https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
        }

        embed.setDescription(this.getDescription(pokemon, entry));


        let location = pokemon.location || "";
        if (null !== pokemon.url) {
            embed.setURL(pokemon.url);
            location += ("" !== location ? "\n\n" : "") + pokemon.url;
            let rx = /^.*(\d+\.\d+)(?:%2C|,)(\d+\.\d+)$/;
            let arr = rx.exec(pokemon.url);
            if (null !== arr) {
                embed.addField("GPS", `${arr[1]} | ${arr[2]}`);
            }
            //embed.setTitle("Afficher sur la carte");
            //embed.setURL(pokemon.url);
        }

        if ("" !== location) {
            embed.addField("Lieu", location);
        }

        if (pokemon.boosted === true) {
            embed.addField("Boost météo", "actif");
        }

        if (pokemon.country !== "fr") {
            embed.addField("Pays", pokemon.country);
        }

        if (mentions.length > 0) {
            embed.addField("Poke", mentions.map(mention => `<@${mention}>`).join(" "));
        }

        embed.setFooter(`Source: ${pokemon.source}`);
        return embed;
    }

    getOrCreateCategory(name) {
        return new Promise(resolve => {
            let category = this.categories[name];
            if (category === undefined) {
                this.getGuild().createChannel(name, "category").then(channel => {
                    this.categories[name] = channel;
                    resolve(channel);
                });
            } else {
                resolve(category);
            }
        });
    }


    getOrCreateChannel(category, name) {
        return new Promise(resolve => {
            let guild = this.getGuild();
            this.getOrCreateCategory(category)
                .then(parent => {
                    let uniqKey = `${category}$#$${name}`;
                    let cache = this.channelsCache[uniqKey];
                    if (cache !== undefined) {
                        resolve(cache);
                    } else {
                        let channel = guild.channels.find(channel => {
                            return channel.name === name && null !== channel.parentID && channel.parentID === parent.id;
                        });
                        if (null === channel) {
                            guild.createChannel(name).then(channel => {
                                channel.setParent(parent);
                                channel.setTopic(`Pokemon selected for ${name}`);
                                this.channelsCache[uniqKey] = channel;
                                resolve(channel);
                            });
                        } else {
                            resolve(channel);
                        }
                    }
                })
        });
    }

};