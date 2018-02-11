const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Logger = require('./helpers/Logger');
const Router = require('./Router');

let folder = __dirname +'/../data/routes';

class WebServer {

    constructor() {
        this.app = express();

        //support parsing of application/json type post data
        this.app.use(bodyParser.json());

        //support parsing of application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: true }));

        let router = express.Router();

        router.get('/rules/:name', (req, res) => {
            res.json(Router.getRule(req.params.name));
        });
        router.post('/rules/:name', (req, res) => {
            let json = req.body.json;
            if(json) {
                Router.saveRule(req.params.name, json);
            }
            res.send(true);
        });
        this.app.use('/serverSide', router);
        this.app.use(express.static('www'))

    }

    init() {
        this.app.listen(3000, () => Logger.info('Server is running. Point your browser to: http://localhost:3000'))
    }
}

module.exports = new WebServer();