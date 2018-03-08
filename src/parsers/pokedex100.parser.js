"use strict";

const rp = require('request-promise');
const CryptoJS = require('crypto-js');
const Pokemon = require('../domain/Pokemon');
const Logger = require('../helpers/Logger');
const config = require('../helpers/Config');

function getCoords(url) {
    let sessionId = config.get('conf:pokedex100:sessionId');
    return new Promise((resolve, error) => {
        if (!sessionId) {
            return resolve(null);
        }
        let j = rp.jar();
        let cookie = rp.cookie('sessionid=' + sessionId);
        j.setCookie(cookie, "https://pokedex100.com");

        rp({
            url: url,
            jar: j
        }).then(content => {

            let rx = /(\$scope\.coordData.*?)\s*(.*?)\s+\n/g;
            let arr = rx.exec(content);
            if (null !== arr) {
                let $scope = {};
                let $interval = () => {
                };
                eval(arr[1] + arr[2]);
                let coords = $scope['coordData'].split(",");
                resolve(coords);
            } else {
                Logger.warn(`Unable to extract coordDate`, {html: content});
                error(`Unable to find coordData for ${url}`);
            }
        });
    });
}

const PARSER_CODE = 'PDX100';
const extractor = new RegExp(/\:flag_(.{2}):\s+(?:\(\d+:\d+\))?\s+\*+([^\*]+)\*+\s+<[^>]*>\s+IV(\d+)\*+\s+CP(\d+)\s+L(\d+)\*+[^\[]*(?:\[([^\]]*)\].*)?.*?\n.*<(https:\/\/pokedex100.com[^>]*)>/);
// 1 : country
// 2 : name
// 3 : IV
// 4 : PC
// 5 : LVL
// 6 : template
// 7 : url

class Parser {

    getPokemon(message, data, gps) {
        let lat;
        let lng;
        if (gps) {
            lat = gps[0];
            lng = gps[1];
        }
        return new Pokemon({
            source: "Pokedex100",
            name: data[2],
            iv: parseInt(data[3], 10),
            lvl: parseInt(data[5], 10),
            pc: parseInt(data[4], 10),
            template: data[6],
            country: data[1],
            url: data[7],
            lat: lat,
            lng: lng,
            channel: message.channel
        });
    }

    parse(message) {
        return new Promise((resolve, reject) => {
            //Logger.debug(`Pokedex100#${message.id}`);
            let arr = extractor.exec(message.content);
            if (null !== arr) {
                getCoords(arr[7]).then(gps => {
                    resolve(this.getPokemon(message, arr, gps));
                    return this.resolve(message, arr, gps);
                }).catch(reason => {
                    Logger.debug(`${PARSER_CODE}: Unable to get gps from `, {url: arr[7]});
                    resolve(this.getPokemon(message, arr, null));
                });
            }
            else {
                reject(`${PARSER_CODE}: Unable to parse message : ${message.content}`);
            }
        });
    }
}

module.exports = Parser;
module.exports.code = PARSER_CODE;
module.exports.extractor = extractor;