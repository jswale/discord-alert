"use strict";

const rp = require('request-promise');
const CryptoJS = require('crypto-js');
const MessageParser = require('../MessageParser');
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
        var cookie = rp.cookie('sessionid=' + sessionId);
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

class Parser {
    constructor() {
        this.cache = {};
    }

    parse(message) {
        return new Promise((resolve, error) => {
            //Logger.debug(`Pokedex100#${message.id}`);
            // :flag_us:  **Wurmple** <a:265:396700075344003072>  IV100** CP437 L31** ♂ [Bug Bite/Struggle] WXL -  *Glen Allen*  <@288375537410375681>\nClick to get coord <https://pokedex100.com/?d=DswbT7RBDn3vW>\n\nSupport us >> <https://www.patreon.com/pokedex100>
            // 1 : country
            // 2 : name
            // 3 : IV
            // 4 : PC
            // 5 : LVL
            // 6 : template
            // 7 : url
            let rx = /\:flag_(.{2})\:\s+(?:\\d+\:\d+\\s+)?\*+([^\*]+)\*+\s+<[^>]*>\s+IV(\d+)\*+\s+CP(\d+)\s+L(\d+)\*+[^\[]*(?:\[([^\]]*)\].*)?<(https:\/\/pokedex100.com[^>]*)>/g;
            let arr = rx.exec(message.content.replace(/\n/g, " "));
            if (null !== arr) {
                if (this.cache[arr[7]] === undefined) {
                    getCoords(arr[7]).then(gps => {
                        let url;
                        if (gps) {
                            //Logger.debug("Coordonnates extracted", {gps: gps, src: arr[7]});
                            url = `https://www.google.com/maps?q=${gps[0]},${gps[1]}`;
                        }
                        this.cache[arr[7]] = true;
                        resolve(new Pokemon("Pokedex100", arr[2], arr[3], arr[5], arr[4], false, arr[6], null, arr[1], null, url));
                    }).catch(reason => error(reason));
                } else {
                    Logger.debug("PDX100: Duplicate entry for ", {url: arr[7]});
                    error("Duplicate entry");
                }
            }
            else {
                Logger.warn("PDX100: Unable to parse message", {content: message.content});
                //Formatter.format(message);
                error("Unable to parse message");
            }
        });
    }
}

MessageParser.register('PDX100', new Parser());
