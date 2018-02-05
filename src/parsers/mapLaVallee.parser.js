"use strict";

const MessageParser = require('../MessageParser');
const Logger = require('../helpers/Logger');
const Pokemon = require("../domain/Pokemon");

class Parser {
    parse(message) {
        return new Promise((resolve, error) => {
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
            error("Not Yet Implemented");
        });
    }
}
MessageParser.register('MLV', new Parser());

