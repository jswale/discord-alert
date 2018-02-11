const Discord = require('discord.js');

const DiscordClient = require('../domain/DiscordClient');
const Logger = require('../helpers/Logger');

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

        this.reply();
    }

    reply() {
        this._replyTo = {};
        // Listener
        this.client.on('message', (message) => {
            let channelId = message.channel.id;

            if (this._replyTo[channelId] === undefined) {
                // Ignore message
                return;
            }

            switch (message.content) {
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
                    }).catch(reason => console.log("Unable to fetch messages"));
                    break;

                case '!h':
                case '!help':
                    message.channel.send(`**Usage**:
!h[elp] afficher l'aide
!c[lear] pour nettoyer le salon des vieux messages
`);
                    break;
            }

        });
    }


    getGuild() {
        if (this.guild === undefined) {
            this.guild = this.client.guilds.find('id', this.conf.guild);
        }
        return this.guild;
    }

    send(pokemon, rule, destination) {
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
            this.broadcast(pokemon, rule, destination);
        }
    }

    broadcast(pokemon, entry, destination) {
        //Logger.debug(`Broadcast to ${destination.group} > ${destination.name}`);
        this.getOrCreateChannel(destination.group, destination.name).then(channel => {
            this._replyTo[channel.id] = true;
            channel.send(DiscordWriter.buildMessage(pokemon, entry, destination.mentions));
        });
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
                                channel.setParent(parent).catch(reason => Logger.warn(`Unable to move ${channel.name} to ${parent.name}`));
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

    static buildMessage(pokemon, entry, mentions = []) {
        let embed = new Discord.RichEmbed();
        embed.setTimestamp(new Date());

        let title;
        if (entry) {
            title = `[${pokemon.country.toUpperCase()}] ${entry.Number} - ${entry.NameLocale}`;
            //embed.setAuthor(`[${pokemon.country.toUpperCase()}] ${entry.Number} - ${entry.NameLocale}`, `https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
            embed.setThumbnail(`https://github.com/PokemonGoF/PokemonGo-Web/raw/46d86a1ecab09412ae870b27ba1818eb311e583f/image/pokemon/${entry.Number}.png`);
        } else {
            title = `[${pokemon.country.toUpperCase()}] ${entry.name}`;
            //embed.setAuthor(`[${pokemon.country.toUpperCase()}] ${entry.name}`);
        }
        if (pokemon.template) {
            title += ` (${pokemon.template})`;
        }
        embed.setTitle(title);

        let description;
        description = `IV: **${pokemon.iv}** / LVL: **${pokemon.lvl}** / CP: **${pokemon.pc}**`;

        if (pokemon.despawn) {
            description += `\nDisparait à ${pokemon.despawn}`;
        }

        if (pokemon.location) {
            description += `\n\n${pokemon.location}`;
        }

        if(pokemon.lat && pokemon.lng) {
            description += `\n\nhttps://www.google.com/maps?q=${pokemon.lat},${pokemon.lng}`;
            embed.setURL(`http://pog.ovh/cc/?lat=${pokemon.lat}&lon=${pokemon.lng}&pkm_id=${parseInt(entry.Number, 10)}`);
        } else if(pokemon.url) {
            description += `\n\n${pokemon.url}`;
            embed.setURL(pokemon.url);
            {
                let rx = /^.*?(\d+\.\d+)(?:%2C|,)(\d+\.\d+)$/;
                let arr = rx.exec(url);
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