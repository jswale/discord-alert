const Discord = require('discord.js');

const DiscordClient = require('../domain/DiscordClient');
const Logger = require('../helpers/Logger');
const Utils = require('../helpers/Utils');
const Router = require('../Router');

class DiscordWriter extends DiscordClient {

    constructor(conf, alias) {
        super(conf, alias);
    }

    onConnection() {
        this._categories = {};
        this._channelsCache = {};
        this._replyTo = {};
        this.getGuild().channels.forEach(channel => {
            if (channel.type === "category") {
                this._categories[channel.name] = channel;
            }
        });

        // Send messages
        if (this.messages !== undefined) {
            let message;
            while ((message = this.messages.pop())) {
                this.send(message).finally();
            }
        }

        this.initBroadcast();
        this.reply();
    }

    /**
     * Initialize the destination channels.
     */
    initBroadcast() {
        Router.getByWriter(this.alias).forEach(destination => {
            this.getOrCreateChannel(destination.group, destination.name)
            //.then(() => Logger.info(`Channel ${destination.name} initialized`))
                .catch(reason => Logger.warn('Unable to initialize broadcast channel', {
                    destination: destination,
                    reason: reason
                }));
        });
    }

    /**
     * Reply mode to answer user actions
     */
    reply() {
        // Listener
        this.client.on('message', (message) => {
            let channelId = message.channel.id;

            if (this._replyTo[channelId] === undefined) {
                // Ignore message
                return;
            }

            let args = message.content.split(' ');
            let command = args[0];
            switch (command) {
                case '!c':
                case '!clear':
                    console.log("Delete data from channel", message.channel.id, message.channel.name);
                    message.channel.fetchMessages().then(entries => {
                        entries.forEach(entry => {
                            entry.delete().catch(reason => Logger.warn("Unable to delete message", {
                                reason: reason,
                                message: message.id
                            }))
                        });
                    }).catch(reason => console.log("Unable to fetch messages", reason));
                    break;

                case '!p':
                case '!pokedex':
                    if (args.length === 2) {
                        let key = args[1];
                        let entry = Utils.getPokedexEntryByNumber(key) || Utils.getPokedexEntryByName(key);
                        if (!entry) {
                            message.channel.send(`:/ Impossible de trouver le pokémon ${key}`);
                        } else {
                            message.channel.send(Utils.getPokedexEntryDetail(entry));
                            message.delete();
                        }
                    } else {
                        message.channel.send(`**Usage**: !p 12`);
                    }
                    break;

                case '!h':
                case '!help':
                    message.channel.send(`**Usage**:
!h[elp] afficher l'aide
!c[lear] pour nettoyer le salon des vieux messages
!p[okedex] informations du pokedex
`);
                    break;
            }

        });
    }

    /**
     * Get the current guild
     *
     * @returns {V | *}
     */
    getGuild() {
        if (this.guild === undefined) {
            this.guild = this.client.guilds.find('id', this.conf.guild);
        }
        return this.guild;
    }

    /**
     * Send a pokemon to a destination
     *
     * @param pokemon the pokemon
     * @param destination the channel destination
     */
    send(pokemon, destination) {
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
            this.broadcast(pokemon, destination);
        }
    }

    /**
     * Broadcast the pokemon to a destination
     *
     * @param pokemon the pokemon
     * @param destination the broadcast channel destination
     */
    broadcast(pokemon, destination) {
        //Logger.debug(`Broadcast to ${destination.group} > ${destination.name}`);
        this.getOrCreateChannel(destination.group, destination.name).then(channel => {
            channel.send(DiscordWriter.buildMessage(pokemon, destination.mentions));
        });
    }

    /**
     * Get or create a category
     *
     * @param name the category name
     * @returns {Promise<any>}
     */
    getOrCreateCategory(name) {
        return new Promise(resolve => {
            let category = this._categories[name];
            if (category === undefined) {
                this.getGuild().createChannel(name, 'category').then(channel => {
                    this._categories[name] = channel;
                    resolve(channel);
                });
            } else {
                resolve(category);
            }
        });
    }

    /**
     * Get or create a channel in a category
     *
     * @param category the category name
     * @param name the channel name
     * @returns {Promise<any>}
     */
    getOrCreateChannel(category, name) {
        return new Promise(resolve => {
            let guild = this.getGuild();
            this.getOrCreateCategory(category)
                .then(parent => {
                    let uniqKey = `${category}$#$${name}`;
                    let cache = this._channelsCache[uniqKey];
                    if (cache !== undefined) {
                        resolve(cache);
                    } else {
                        let channel = guild.channels.find(channel => {
                            return channel.name === name && null !== channel.parentID && channel.parentID === parent.id;
                        });
                        if (null === channel) {
                            guild.createChannel(name).then(channel => {
                                channel.setParent(parent).catch(reason => Logger.warn(`Unable to move ${channel.name} to ${parent.name}`, {reason: reason}));
                                channel.setTopic(`Pokemon selected for ${name}`);
                                this._channelsCache[uniqKey] = channel;
                                this._replyTo[channel.id] = true;
                                resolve(channel);
                            });
                        } else {
                            this._channelsCache[uniqKey] = channel;
                            this._replyTo[channel.id] = true;
                            resolve(channel);
                        }
                    }
                })
        });
    }

    /**
     * Create the message
     *
     * @param pokemon the pokemon
     * @param mentions list of users id to be mentionned
     * @returns {"discord.js".RichEmbed}
     */
    static buildMessage(pokemon, mentions = []) {
        let embed = new Discord.RichEmbed();
        embed.setTimestamp(new Date());

        let title;
        let entry = pokemon.pokedexEntry;
        if (entry) {
            title = `[${pokemon.country.toUpperCase()}] ${entry.Number} - ${entry.NameLocale}`;
            //embed.setAuthor(`[${pokemon.country.toUpperCase()}] ${entry.Number} - ${entry.NameLocale}`, `https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
            embed.setThumbnail(`https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
        } else {
            title = `[${pokemon.country.toUpperCase()}] ${pokemon.name}`;
            //embed.setAuthor(`[${pokemon.country.toUpperCase()}] ${entry.name}`);
        }
        if (pokemon.template) {
            title += ` (${pokemon.template})`;
        }
        embed.setTitle(title);

        let description = ['iv', 'lvl', 'pc'].filter(key => pokemon[key]).map(key => `${key.toUpperCase()}: **${pokemon[key]}**`).join(' / ');

        if (pokemon.despawn) {
            description += `\nDisparait à ${pokemon.despawn}`;
        }

        if (pokemon.location) {
            description += `\n\n${pokemon.location}`;
        }

        if (pokemon.lat && pokemon.lng) {
            description += `\n\nhttps://www.google.com/maps?q=${pokemon.lat},${pokemon.lng}`;
            embed.setURL(`http://pog.ovh/cc/?lat=${pokemon.lat}&lon=${pokemon.lng}&pkm_id=${parseInt(entry.Number, 10)}`);
        } else if (pokemon.url) {
            description += `\n\n${pokemon.url}`;
            embed.setURL(pokemon.url);
            {
                let rx = /^.*?(\d+\.\d+)(?:%2C|,)(\d+\.\d+)$/;
                let arr = rx.exec(pokemon.url);
                if (null !== arr) {
                    description += `\n\nGPS: ${arr[1]} | ${arr[2]}`;
                    if (entry) {
                        embed.setURL(`http://pog.ovh/cc/?lat=${arr[1]}&lon=${arr[2]}&pkm_id=${parseInt(entry.Number, 10)}`);
                    }
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
}

module.exports = DiscordWriter;