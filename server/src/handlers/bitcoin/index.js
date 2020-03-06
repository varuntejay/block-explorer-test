const express = require('express');
const { getConnection } = require('../../lib/mongo')
const { getFilteredTransactions, getStats, getLatestHighlights } = require('./../filterTransactions/btcTransactionFilter')
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
    const db = dbConnection.db('bitcoin_db');
    console.log(req.body)
    let projections = {
        "height": 1,
        "hash": 1,
        "tx": 1,
        "time": 1
    }

    db.collection('blocks').find({ "height": { $lte: blocksHeight } }).project(projections).sort({ "height": -1 }).skip(latestBlockOffset).limit(size).toArray((err, result) => {
        // console.log("blocks", result)
        res.send(
            {
                status: true,
                blocks: result
            })
    })
})


router.post('/getTxnDetails', async (req, res) => {

    const db = dbConnection.db('bitcoin_db');
    console.log(req.body)

    db.collection('transactions').find({ "height": parseInt(req.body.blockNumber), "txnIndex": parseInt(req.body.transactionIndex) }).project({}).toArray((err, result) => {
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

    const db = dbConnection.db('bitcoin_db');

    // 493300
    
    db.collection('transactions').deleteMany({ "height": {"$gte" : 493300}}, (err, result) => {
        console.error(err)
        console.log(result);
        res.send({staus: true, result: result})
    })
})



router.post("/getBlockCount", async (req, res) => {

    const db = dbConnection.db('bitcoin_db');

    db.collection('blocks').find().project({ "height": 1 }).sort({ "height": -1 }).limit(1).toArray((err, result) => {
        console.log("blocks", result)
        res.send(
            {
                status: true,
                blocksHeight: result[0].height
            })
    })
});

router.post("/filterTransactions", async (req, res) => {

    console.log(req.body)
    const db = dbConnection.db('bitcoin_db');
    db.collection('blocks').find().project({ "time": 1 }).sort({ "height": -1 }).limit(1).toArray(async (err, result) => {
        getFilteredTransactions({ "endTime": result[0].time, "minBtc": req.body.coins })
            .then((filteredData) => {
                console.log(filteredData)
                res.status(200).send({ txns: filteredData })
            })
    })

    // let filterParams = req.body;
    // let filteredData = await getFilteredTransactions(filterParams);
    // console.log(filteredData)
    // res.status(200).send({ result: filteredData })

});

router.post("/getStats", async (req, res) => {
    console.log(req.body)
    let stats = await getStats(parseInt(req.body.timeUnit))
    console.log(stats)
    res.status(200).send(stats)
});

router.post("/getLatestHighlights", async (req, res) => {
    console.log('called')
    const db = dbConnection.db('bitcoin_db');
    let timeUnit = parseInt(req.body.timeUnit)
    let latestBlockTimestamp = await db.collection('blocks').find({}).project({"_id": -1, "time": 1}).sort({ "height": -1 }).limit(1).toArray()
    console.log(latestBlockTimestamp)
    let result = await getLatestHighlights(latestBlockTimestamp[0].time, 24*timeUnit)
    console.log('called end')
    res.status(200).send(result)
});
module.exports = router;