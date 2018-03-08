"use strict";

const Logger = require('../helpers/Logger');
const Pokemon = require("../domain/Pokemon");

const PARSER_CODE = 'MLV';
const extractor = new RegExp(/IV : (\?{3}|\d+\.\d+|\d+)% \(([^)]+)\)\sLV : (\?|\d+).*?PC : (\?|\d+)\s(.*?)\s+(\d+\.\d+),(\d+\.\d+)\s(.*?)\s+(.*?(\d{5}) (.*))\sDepop : (\d+:\d+:\d+)/);
// 1 : IV
// 2 : attaque / defense / pv
// 3 : LVL
// 4 : PC
// 5 : template
// 6 : lat
// 7 : lng
// 8 : naji link
// 9 : location
//10 : postal code
//11 : city
// 12 : despawn

class Parser {
    parse(message) {
        return new Promise((resolve, reject) => {

            let embeds = message.embeds;
            if (embeds.length > 0) {
                let name = message.author.username;
                let messageEmbed = embeds[0];
                let description = messageEmbed.description;
                //let title = messageEmbed.title;
                //let city = /^\[(.*?)\]/.exec(title);

                let arr = extractor.exec(description);
                if (null !== arr) {
                    return resolve(new Pokemon({
                        source: "Map la vallée",
                        name: name,
                        iv: arr[1] === '???' ? null : parseInt(arr[1], 10),
                        lvl: arr[3] === '?' ? null : parseInt(arr[3], 10),
                        pc: arr[4] === '?' ? null : parseInt(arr[4], 10),
                        template: arr[5] === 'unknown / unknown' ? null : arr[5],
                        despawn: arr[12],
                        country: 'fr',
                        postalCode: arr[10],
                        city: arr[11],
                        location: arr[9],
                        lat: arr[6],
                        lng: arr[7],
                        channel : message.channel
                    }));
                }
            }
            reject(`${PARSER_CODE}: Unable to parse message : ${message.content}`);
        });
    }
}

module.exports = Parser;
module.exports.code = PARSER_CODE;
module.exports.extractor = extractor;
