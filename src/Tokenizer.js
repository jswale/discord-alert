const Discord = require('discordv8');

module.exports = {
    get: function (email, password) {
        return new Promise((resolve, reject) => {
            let client = new Discord.Client();
            client.login(email, password, (error, token) => {
                if (error) {
                    console.log(`There was an error logging in with ${email}: ${error}`);
                    reject();
                } else {
                    //console.log(`Token: ${token}`);
                    resolve(token);
                }
            });
        })
    }
};
