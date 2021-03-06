'use strict';

const Discord = require('discordv8');
const Logger = require('./helpers/Logger');

function getToken(email, password) {
    return new Promise((resolve, reject) => {
        // noinspection Annotator
        let client = new Discord.Client();
        client.login(email, password, (error, token) => {
            if (error) {
                Logger.error(`There was an error logging in with ${email}: ${error}`);
                reject();
            }
            else {
                resolve(token);
            }
        });
    });
}

module.exports = {getToken};