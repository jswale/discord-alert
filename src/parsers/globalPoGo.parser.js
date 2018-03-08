'use strict';

const Logger = require('../helpers/Logger');
const Utils = require('../helpers/Utils');
const Pokemon = require('../domain/Pokemon');

const PARSER_CODE = 'GPG';
const extractor = new RegExp(/^(?:.*?\n)?\:flag_(.{2}):\s+\*{2}\[.*]\*{2}\s+\*{2}([^\*]+)\*{2}\s-\s<[^>]+>\s\*{2}(\d+)\*{2}\s<[^>]+>\s\*{2}(\d+)\*{2}\s\*{3}\s\:\w+\:\ (.*)\*{3}\s<[^>]+>\s\*{2}(\d+)\*{2}\s<\:(\w+)\:[^>]+>\*{2}\s-{2}\s<[^>]+>\s(-?\d+.\d+),\s(-?\d+.\d+)\s\:.*?\:\ (\d+\:\d+\:\d+)\ left.(?:\*{2})?\n.*?<(http:\/\/global.*?)>/);
// 1 : country
// 2 : name
// 3 : IV
// 4 : CP
// 5 : template
// 6 : LVL
// 7 : sex
// 8 : lat
// 9 : lng
//10 : despawn
//11 : url

class Parser {
    parse(message) {
        return new Promise((resolve, reject) => {
            // Logger.debug(`${PARSER_CODE}#${message.id}`, {message:message.content});

            let arr = extractor.exec(message.content);
            if (null !== arr) {
                resolve(new Pokemon({
                    source: 'Global PoGo',
                    name: arr[2],
                    iv: parseInt(arr[3], 10),
                    lvl: parseInt(arr[6], 10),
                    pc: parseInt(arr[4], 10),
                    template: arr[5],
                    despawn: Utils.dateFromNow(Utils.dateToMinute(arr[10])),
                    country: arr[1],
                    url: arr[11],
                    lat: arr[8],
                    lng: arr[9],
                    channel: message.channel
                }));
            } else {
                reject(`${PARSER_CODE}: Unable to parse message : ${message.content}`);
            }
        });
    }
}

module.exports = Parser;
module.exports.code = PARSER_CODE;
module.exports.extractor = extractor;
