"use strict";
const Utils = require('../helpers/Utils');

class Pokemon {
    constructor(def) {
        this.source = def.source;
        this.name = def.name;
        this.iv = def.iv;
        this.ivDetails = def.ivDetails;
        this.lvl = def.lvl;
        this.pc = def.pc;
        this.boosted = def.boosted;
        this.template = def.template;
        this.despawn = def.despawn;
        this.country = def.country;
        this.location = def.location;
        this.city = def.city;
        this.postalCode = def.postalCode;
        this.lat = def.lat;
        this.lng = def.lng;
        this.url = def.url;
        if(def.channel) {
            this.channelId = def.channel.id;
            this.channelName = def.channel.name;
            this.guildId = def.channel.guild.id;
            this.guildName = def.channel.guild.name;
        }

        this.identifier = [this.name, this.iv, this.lvl, this.pc, this.lat, this.lng].filter(key=>!!key).join('#$#');

        //console.log(`PKM: ${this.identifier}`);

        this.pokedexEntry = Utils.getPokedexEntry(this);
    }

    toPokeAlarmFormat() {
        let data = {
            "encounter_id": Math.floor(Math.random() * 10000000000),
            "spawnpoint_id": Math.floor(Math.random() * 10000000000),
            "player_level": 31,
        };

        if (typeof this.pokedexEntry === 'object' && this.pokedexEntry.Number) {
            data['pokemon_id'] = this.pokedexEntry.Number;
        }

        if (this.lat) {
            data['latitude'] = this.lat;
        }

        if (this.lng) {
            data['longitude'] = this.lng;
        }

        if (this.despawn) {
            let disappearTime = new Date();
            let hour = this.despawn.split(':');
            if (hour && hour.length === 2) {
                if (hour[0] === '00' && disappearTime.getHours() === 23) {
                    disappearTime.setHours(hour[0]);
                    disappearTime.setDate(disappearTime.getDate() + 1);
                } else {
                    disappearTime.setHours(hour[0]);
                }
                disappearTime.setMinutes(hour[1]);

                data['disappear_time'] = Math.floor(disappearTime.getTime() / 1000);
            }
        }

        if (this.pc) {
            data['cp'] = this.pc;
        }

        if (this.lvl) {
            data['pokemon_level'] = this.lvl;
        }

        if (this.ivDetails) {
            let ivs = this.ivDetails.split('/');
            if (ivs && ivs.length === 3) {
                data['individual_attack'] = ivs[0];
                data['individual_defense'] = ivs[1];
                data['individual_stamina'] = ivs[2];
            }
        }

        return data;
    }
}

module.exports = Pokemon;
