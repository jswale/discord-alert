'use strict';

const MessageParser = require('../MessageParser');
const Logger = require('../helpers/Logger');
const Pokemon = require('../domain/Pokemon');

const extractor = new RegExp(/\[([^\]]+)\]\s:\s\*{2}([^\*]+)\*{2}\s.\s+IV\*{2}(\d+)%\*{2}\s+LVL\*{2}(\d+)\*{2}\s+PC\*{2}(\d+)\*\*\sDespawn\s+(\d{2}\:\d{2})\s(\*{2}Boost météo [^\*]*\*{2}\s+)?\(([^\)]*)\)\s(?:\(([^\)]*)\)\s+)?\(([^\)]*)\)\s+(http.*)/);
// 1 : postalCode
// 2 : name
// 3 : IV
// 4 : lvl
// 5 : pc
// 6 : despawn
// 7 : boosted
// 8 : ATT/DEF/PV
// 9 : template
//10 : location
//11 : url

class Parser {
    parse(message) {
        return new Promise((resolve, reject) => {
            //Logger.debug(`livePokeMapParis#${message.id}`, message.content);

            let arr = extractor.exec(message.content);
            if (null !== arr) {
                let lat;
                let lng;
                var gps = /https:\/\/www.google.com\/.*?(\d+\.\d+).*(\d+\.\d+)/.exec(arr[11]);
                if (gps) {
                    lat = gps[1];
                    lng = gps[2];
                }
                resolve(new Pokemon({
                    source: 'LivePokeMapParis',
                    name: arr[2],
                    iv: parseInt(arr[3], 10),
                    lvl: parseInt(arr[4], 10),
                    pc: parseInt(arr[5], 10),
                    boosted: null !== arr[7],
                    template: arr[9],
                    despawn: arr[6],
                    country: 'fr',
                    location: arr[10],
                    url: arr[11],
                    lat: lat,
                    lng: lng
                }));
            } else {
                Logger.debug(`LPMP#${message.id} : ${message.content}`);
                Logger.warn('LPMP: Unable to parse message', {message: message.content});
                //Formatter.format(message);
                reject('LPMP: Unable to parse message');
            }
        });
    }
}

MessageParser.register('LPMP', new Parser());

module.exports = Parser;
module.exports.extractor = extractor;
