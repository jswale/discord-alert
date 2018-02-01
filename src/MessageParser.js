const Pokemon = require("./Pokemon.class");

const pokedex100Cache = {};

module.exports = class MessageParser {
    static parse(message, parser) {
        switch (parser) {
            case "MLV":
                return MessageParser.MapLaValee(message);
            case "LPMP" :
                return MessageParser.LivePokeMapParis(message);
            case "PDX100" :
                return MessageParser.Pokedex100(message);
            default:
                return MessageParser.format(message);
        }
    }

    static Pokedex100(message) {
        //console.log(`Pokedex100#${message.id}`);
        // :flag_us:  **Wurmple** <a:265:396700075344003072>  IV100** CP437 L31** ♂ [Bug Bite/Struggle] WXL -  *Glen Allen*  <@288375537410375681>\nClick to get coord <https://pokedex100.com/?d=DswbT7RBDn3vW>\n\nSupport us >> <https://www.patreon.com/pokedex100>
        let rx = /\:flag_(.{2})\:\s+(?:\\d+\:\d+\\s+)?\*+([^\*]+)\*+\s+<[^>]*>\s+IV(\d+)\*+\s+CP(\d+)\s+L(\d+)\*+[^\[]*(?:\[([^\]]*)\].*)?<(https:\/\/pokedex100.com[^>]*)>/g;
        // 1 : country
        // 2 : name
        // 3 : IV
        // 4 : PC
        // 5 : LVL
        // 6 : template
        // 7 : url
        let arr = rx.exec(message.content.replace(/\n/g, " "));
        if (null !== arr) {
            if (true === pokedex100Cache[arr[6]]) {
                console.log("Found duplicate post");
            } else {
                pokedex100Cache[arr[6]] = true;
                return new Pokemon("Pokedex100", arr[2], arr[3], arr[5], arr[4], false, arr[6], arr[1], null, arr[7]);
            }
        } else {
            console.log("Fallback PD1k", message.content);
            //Formatter.format(message);
        }
        return null;
    }

    static LivePokeMapParis(message) {
        console.log(`livePokeMapParis#${message.id}`, message.content);
        // [94000] : **Skitty** ♀  IV**100%** LVL**30** PC**565** Despawn 15:22 (15/15/15) (2 Rue Gustave Eiffel, 94000 Créteil, France) https://www.google.com/maps?q=48.79843493158520%2C2.45248360055324
        let rx = /\[(\d+)]\s:\s\*{2}([^\*]+)\*{2}\s.\s+IV\*{2}(\d+)%\*{2}\s+LVL\*{2}(\d+)\*{2}\s+PC\*{2}(\d+)\*\*\sDespawn\s+(\d{2}\:\d{2})\s(\*{2}Boost météo [^\*]*\*{2}\s+)?\(([^\)]*)\)\s(?:\(([^\)]*)\)\s+)?\(([^\)]*)\)\s+(http.*)/g;
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
        let arr = rx.exec(message.content.replace(/\n/g, " "));
        if (null !== arr) {
            return new Pokemon("LivePokeMapParis", arr[2], arr[3], arr[4], arr[5], null !== arr[7], arr[9], 'fr', arr[10], arr[11]);
        } else {
            console.log("Fallback LPMP", message.content);
            //Formatter.format(message);
        }
        return null;
    }


    static MapLaValee(message) {
        //console.log("MapLaValee", message);
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
        return null;
    }

    static format(message) {
        console.log(`format#${message.id}`);
        return `(${message.channel.name}): ${message.content.replace(/\n/g, " ")}`;
    }
};