'use strict';

const MessageParser = require('../MessageParser');
const Logger = require('../helpers/Logger');
const Pokemon = require('../domain/Pokemon');

class Parser {
    parse(message) {
        return new Promise((resolve) => {
            //Logger.debug(`livePokeMapParis#${message.id}`, message.content);
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
            let rx = /\[([^\]]+)\]\s:\s\*{2}([^\*]+)\*{2}\s.\s+IV\*{2}(\d+)%\*{2}\s+LVL\*{2}(\d+)\*{2}\s+PC\*{2}(\d+)\*\*\sDespawn\s+(\d{2}\:\d{2})\s(\*{2}Boost météo [^\*]*\*{2}\s+)?\(([^\)]*)\)\s(?:\(([^\)]*)\)\s+)?\(([^\)]*)\)\s+(http.*)/g;
            let arr = rx.exec(message.content.replace(/\n/g, ' '));
            if (null !== arr) {
                resolve(new Pokemon('LivePokeMapParis', arr[2], arr[3], arr[4], arr[5], null !== arr[7], arr[9], arr[6], 'fr', arr[10], arr[11]));
            } else {
                Logger.debug(`livePokeMapParis#${message.id} : ${message.content}`);
                Logger.warn('LPMP: Unable to parse message', {message: message.content});
                //Formatter.format(message);
                resolve('LPMP: Unable to parse message');
            }
        });
    }
}

MessageParser.register('LPMP', new Parser());