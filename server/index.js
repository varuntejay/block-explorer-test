const express                       = require('express');
const bodyParser                    = require('body-parser');
const ethHandler                    = require('./src/handlers/eth');
const bitcoinHandler                = require('./src/handlers/bitcoin');
const priceHandler                  = require('./src/handlers/price')


const app               = express();
const port              = process.env.PORT || 9086;

boot = () => {
    intialize();
    registerRoutes();
    server();
}

intialize = () => {
    app.use(bodyParser.json());
}
registerRoutes = () => {
    app.get('/', (req, res) => res.send({status: true, msg: 'Hello from server'}));    
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
        res.setHeader("Access-Control-Allow-Headers", "Accept, Access-Control-Allow-Headers, Access-Control-Request-Headers, Access-Control-Request-Method, Authorization, Content-Type, Origin, X-Requested-With");
        next();
    });

    app.use('/eth', ethHandler);
    app.use('/bitcoin', bitcoinHandler)    
    app.use('/price', priceHandler)
}

server = () => {
    app.listen(port, () => {
        console.log('Listening on Port: ' + port);
    })
}

boot();
