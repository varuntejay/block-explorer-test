const { getConnection } = require('../../lib/mongo');
const moment = require('moment');
const {
    BTC_FIRST_BLOCK_DATE
} = require('../../globalconfig')
let dbConnection;
getConnection()
    .then((result) => {
        dbConnection = result;
    });
module.exports.getFilteredTransactions = async (filterParams) => {
    let minBtc = filterParams.minBtc
    if (filterParams.endTime) {
        let endTime = filterParams.endTime;
        let startTime = filterParams.startTime || endTime - 864000;
        let projections = {
            "projection": {
                "_id": 0,
                "value": 1,
                "height": 1,
                "txnIndex": 1,
                "hash": 1
            }
        }
        let query = {

            $and: [{ time: { $gt: startTime } }, { time: { $lt: endTime } }, { value: { $gt: parseFloat(minBtc) } }]

        }
        console.log(JSON.stringify(query))
        let filteredTransactions = await dbConnection.db("bitcoin_db").collection("transactions").find(query, projections).limit(50).toArray()
        console.log(filteredTransactions
        )
        return filteredTransactions
    }
}

module.exports.getStats = async (timeUnit) => {
    let latestBlockDetails = await dbConnection.db("bitcoin_db").collection('blocks').find().project({ "height": 1, "time": 1 }).sort({ "height": -1 }).limit(1).toArray()
    let transactionStats = await dbConnection.db("bitcoin_db").collection('transactions').stats()

    let timestamp = moment.unix(latestBlockDetails[0]["time"]).subtract( timeUnit -1, 'days').startOf('day').unix();
    let count = await dbConnection.db("bitcoin_db").collection('transactions').count({time: {"$gte" : timestamp}})
    
    let totalTransactionCount = transactionStats.count
    let daysSinceFirstBlock = moment.unix(latestBlockDetails[0]["time"]).diff(moment.unix(BTC_FIRST_BLOCK_DATE), "days")

   let result = {
        avgNoOfBlocks: parseInt(latestBlockDetails[0]["height"] * timeUnit / daysSinceFirstBlock),
        avgNoTransactions: parseInt(totalTransactionCount * timeUnit / daysSinceFirstBlock),
        totalNumberOfTransactions: count
    }
    console.log(result)
    return result
}