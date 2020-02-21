const express = require('express');
const { getConnection } = require('../../lib/mongo')
const moment = require('moment');
const router = express.Router();
let dbConnection;

getConnection()
    .then((result) => {
        dbConnection = result;
    })

router.post('/add', async (req, res) => {

    let date = req.body.date;
    console.log(date.match(/^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/g))
    if (req.body.hasOwnProperty('price') && req.body.hasOwnProperty('cryptoType') && req.body.hasOwnProperty('date')) {
        let price = req.body.price;
        let cryptoType = req.body.cryptoType;

        let errors = [];
        if (isNaN(parseFloat(price))) {
            errors.push('Price should be a float type and it should be greater then 0')
        }
        if (cryptoType !== 'eth' && cryptoType !== 'btc') {
            errors.push('Crypto type should be eth or btc')
        }
        if (!date.match(/^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/g)) {
            errors.push('Date should have pattren DD/MM/YYYY')
        }

        if (errors.length > 0) {
            res.status(400).send({ status: false, errors: errors })
        } else {
            let db;
            if (cryptoType === 'eth') {
                db = dbConnection.db('eth_db');
            } else {
                db = dbConnection.db('bitcoin_db');
            }

            let document = {
                "timestamp": moment(date, 'DD/MM/YYYY').unix(),
                "price": parseFloat(price)
            }

            console.log(document)

            db.collection('prices').insertOne(document, (err, result) => {
                console.error(err)
                res.status(200).send({ status: true, document: document, result: result })
            })
        }
    } else {
        res.status(400).send({ status: false, msg: 'Request body should have price, cryptoType, date fields in json format' })
    }
})

router.post('/get', async (req, res) => {
    const ethDB = dbConnection.db('eth_db');
    const btcDB = dbConnection.db('bitcoin_db')

    let timestamp = moment().startOf('day').unix()
    console.log(timestamp)
    // let eth = await ethDB.collection('prices').find({ "timestamp": timestamp }).toArray();
    // let btc = await btcDB.collection('prices').find({ "timestamp": timestamp }).toArray();
    let eth = 266.812336
    let btc = 9728.123146

    res.send({ status: true, eth: eth[0], btc: btc[0] })
})

module.exports = router;