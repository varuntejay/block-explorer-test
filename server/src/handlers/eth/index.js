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
    const db = dbConnection.db('eth_db');
    let start = req.body.start || 0
    let size = req.body.size || 10

    db.collection('blocks').find().skip(start).limit(size).toArray((err, result) => {
        console.log("blocks", result)
        res.send(
            {
                status: true,
                result: result
            })

    })
})
router.post("/getBlockCount", async (req, res) => {
    const db = dbConnection.db('eth_db');
    db.collection('blocks').countDocuments((err, result) => {
        res.send({ "blockCount": result })
    })
});

module.exports = router;