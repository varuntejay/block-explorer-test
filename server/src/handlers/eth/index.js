const express = require('express');
const { getConnection } = require('../../lib/mongo')
const { MONGODB_PROVIDER } = require('../../globalconfig');;

const router = express.Router();
let dbConnection;
getConnection()
.then((result) => {
    dbConnection = result;
})


router.post('/getBlocksWithPagination', async (req, res) => {
    console.log(dbConnection)
    const db =  dbConnection.db('eth_db');
    db.collection('blocks').find({"timestamp": 1}).toArray((err, result) => {
        console.log(result)
        res.send({ status: true })
    })
})

module.exports = router;