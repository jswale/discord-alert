const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('./helpers/Logger');
const config = require('../helpers/Config');
const Router = require('./Router');
const Listener = require('./Listener');

class WebServer {

    constructor() {
        this.app = express();

        //support parsing of application/json type post data
        this.app.use(bodyParser.json());

        //support parsing of application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: true}));

        let router = express.Router();

        // Rules
        router.get('/rules', (req, res) => {
            res.json(Router.getFiles());
        });
        router.get('/rules/reload', (req, res) => {
            Router.init();
            res.send(true);
        });
        router.get('/rule/:name', (req, res) => {
            let rule = Router.getByName(req.params.name);
            if (rule) {
                res.json(rule);
            } else {
                res.send(false);
            }

        });
        router.post('/rule/:name', (req, res) => {
            let json = req.body.json;
            if (json) {
                Router.save(req.params.name, json);
            }
            res.send(true);
        });

        this.app.use('/serverSide', router);
        this.app.use(express.static('www'))

    }

    init() {
        if (true === config.get('conf:webServer:enabled')) {
            this.app.listen(config.get('conf:webServer:port'), () => Logger.info('Server is running. Point your browser to: http://localhost:3000'))
        }
    }
}

module.exports = new WebServer();