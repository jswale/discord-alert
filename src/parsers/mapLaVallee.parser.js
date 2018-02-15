"use strict";

const MessageParser = require('../MessageParser');
const Logger = require('../helpers/Logger');
const Pokemon = require("../domain/Pokemon");

const extractor = new RegExp(/IV : (\?{3}|\d+\.\d+|\d+)% \(([^\)]+)\)\sLV : (\?|\d+).*?PC : (\?|\d+)\s(.*?)\s+(\d+\.\d+),(\d+\.\d+)\s(.*?)\s+(.*?)\sDepop : (\d+:\d+:\d+)/);
// 1 : IV
// 2 : attaque / defense / pv
// 3 : LVL
// 4 : PC
// 5 : template
// 6 : lat
// 7 : lng
// 8 : naji link
// 9 : location
// 10 : despawn

class Parser {
    parse(message) {
        return new Promise((resolve, reject) => {

            let embeds = message.embeds;
            if(embeds.length>0) {
                let name = message.author.username;
                let messageEmbed = embeds[0];
                let description = messageEmbed.description;

                let arr = extractor.exec(description);
                if (null !== arr) {
                    return resolve(new Pokemon({
                        source: "Map la vallée",
                        name: name,
                        iv: arr[1] === '???' ? undefined : parseInt(arr[1], 10),
                        lvl: arr[3] === '?' ? undefined : parseInt(arr[3], 10),
                        pc: arr[4] === '?' ? undefined : parseInt(arr[4], 10),
                        template: arr[5] === 'unknown / unknown' ? undefined : arr[5],
                        despawn : arr[10],
                        country: 'fr',
                        location: arr[9],
                        lat: arr[6],
                        lng: arr[7]
                    }));
                }
            }
            Logger.debug(`MLV#${message.id} : ${message.content}`);
            Logger.warn('MLV: Unable to parse message', message);
            //Formatter.format(message);
            reject('MLV: Unable to parse message');

            //Logger.debug("MapLaValee", message);
            //Formatter.format(message);
            /*
            embeds:
               [ MessageEmbed {
                   message: [Circular],
                   type: 'rich',
                   title: '[Bussy-Saint-Georges] Arcko ???%',
                   description: 'IV : ???% (?/?/?)\nLV : ? | PC : ?\nunknown / unknown\n\n48.8469334692,2.69656179552\nhttp://pog.ovh/cc/?lat=48.84693&lon=2.69656&pkm_id=252\n\n14 Rue de Saint-Martin 77600 Bussy-Saint-Georges\nDepop : 23:30:07 (20m 45s)',
                   url: 'http://maps.google.com/maps?q=48.84693346922325,2.6965617955172956',
            */
        });
    }
}

MessageParser.register('MLV', new Parser());

module.exports = Parser;
module.exports.extractor = extractor;
