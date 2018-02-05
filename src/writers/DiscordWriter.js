const Discord = require('discord.js');

const DiscordClient = require('../DiscordClient');
const Utils = require('../helpers/Utils');
const Logger = require('../helpers/Logger');
const Filter = require('../Filter');

class DiscordWriter extends DiscordClient {

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
            this.guild = this.client.guilds.find('id', this.conf.guild);
        }
        return this.guild;
    }

    send(pokemon) {
        if (false === this.connected) {
            if (this.messages === undefined) {
                this.messages = [];
            }
            this.messages.push(pokemon);
            return;
        }

        if (typeof pokemon === 'string') {
            this.getOrCreateChannel('Divers', 'vrac').then(channel => channel.send(pokemon));
        } else {
            this.broadcast(pokemon);
        }
    }

    broadcast(pokemon) {
        Logger.debug(`[${pokemon.country}] IV:${pokemon.iv} LVL:${pokemon.lvl} PC:${pokemon.pc}`);

        let entry = Utils.getPokedexEntry(pokemon);
        Filter.get(pokemon, entry).forEach(rule => {
            Logger.debug(`Broadcast to ${rule.group} > ${rule.name}`);
            this.getOrCreateChannel(rule.group, rule.name).then(channel => {
                channel.send(this.buildMessage(pokemon, entry, rule.mentions));
            });
        });
    }

    buildMessage(pokemon, entry, mentions = []) {
        let embed = new Discord.RichEmbed();
        embed.setTimestamp(new Date());

        if (entry) {
            embed.setTitle(`[${pokemon.country.toUpperCase()}] ${entry.Number} - ${entry.NameLocale}`);
            //embed.setAuthor(`[${pokemon.country.toUpperCase()}] ${entry.Number} - ${entry.NameLocale}`, `https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
            embed.setThumbnail(`https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
        } else {
            embed.setTitle(`[${pokemon.country.toUpperCase()}] ${entry.name}`);
            //embed.setAuthor(`[${pokemon.country.toUpperCase()}] ${entry.name}`);
        }

        let description;
        description = `IV: **${pokemon.iv}** / LVL: **${pokemon.lvl}** / CP: **${pokemon.pc}**`;
        if (pokemon.template) {
            description += `\n${pokemon.template}`;
        }

        if (pokemon.despawn) {
            description += `\nDisparait à ${pokemon.despawn}`;
        }


        if (pokemon.location) {
            description += `\n\n${pokemon.location}`;
        }

        if (pokemon.url) {
            description += `\n\n${pokemon.url}`;
            embed.setURL(pokemon.url);
            {
                let rx = /^.*?(\d+\.\d+)(?:%2C|,)(\d+\.\d+)$/;
                let arr = rx.exec(pokemon.url);
                if (null !== arr) {
                    description += `\n\nGPS: ${arr[1]} | ${arr[2]}`;
                }
            }
        }

        embed.setDescription(description);

        if (mentions.length > 0) {
            embed.addField('Poke', mentions.map(mention => `<@${mention}>`).join(' '));
        }

        embed.setFooter(`Source: ${pokemon.source}`);
        return embed;
    }

    getOrCreateCategory(name) {
        return new Promise(resolve => {
            let category = this.categories[name];
            if (category === undefined) {
                this.getGuild().createChannel(name, 'category').then(channel => {
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

module.exports = DiscordWriter;