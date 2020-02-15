const express = require('express');
const { getConnection } = require('../../lib/mongo')
const { MONGODB_PROVIDER } = require('../../globalconfig');;
const mongodb = require('mongodb');

const router = express.Router();
let dbConnection;
getConnection()
    .then((result) => {
        dbConnection = result;
    })


router.post('/getBlocksWithPagination', async (req, res) => {
    const latestBlockOffset = req.body.latestBlockOffset
    const size = req.body.size
    const blocksHeight = req.body.blocksHeight
    const db = dbConnection.db('eth_db');
    console.log(req.body)
    let projections = {
        "number": 1,
        "hash": 1,
        "transactions": 1,
        "timestamp": 1
    }

    db.collection('blocks').find({ "number": { $lte: blocksHeight } }).project(projections).sort({ "number": -1 }).skip(latestBlockOffset).limit(size).toArray((err, result) => {
        // console.log("blocks", result)
        res.send(
            {
                status: true,
                blocks: result
            })
    })
})


router.post('/getTxnDetails', async (req, res) => {
    const txnHash = req.body.txnHash
        const db = dbConnection.db('eth_db');
    console.log(req.body)

    db.collection('transactions').find({ "blockNumber": 500002, "transactionIndex": 0 }).project({}).toArray((err, result) => {
        console.error(err)
        console.log("txn", result[0])
        res.send(
            {
                status: true,
                txn: result[0]
            })
    })
})

router.post("/deleteDocument", async (req, res) => {

    // const db = dbConnection.db('eth_db');
    // db.collection('blocks').deleteOne({ "_id": new mongodb.ObjectID("5e44e61b4f46132edef842e2")}, (err, result) => {
    //     console.error(err)
    //     console.log(result);
    //     res.send({staus: true, result: result})
    // })

})

router.post("/getBlockCount", async (req, res) => {

    const db = dbConnection.db('eth_db');

    db.collection('blocks').stats((err, result) => {
        console.log(result.count)
        res.send({status: true, blocksHeight: result.count})
    })
});

module.exports = router;