const { getConnection } = require('../../lib/mongo');
const moment = require('moment');
const {
    ETH_FIRST_BLOCK_DATE
} = require('../../globalconfig')

let dbConnection;
getConnection()
    .then((result) => {
        dbConnection = result;
    });
module.exports.getFilteredTransactions = async (filterParams) => {
    let minEth = filterParams.minEth
    if (filterParams.endTime) {
        let endTime = filterParams.endTime;
        let startTime = filterParams.startTime || endTime - 86400;
        let query = {

            $and: [{ timestamp: { $gt: startTime } }, { timestamp: { $lt: endTime } }]

        }

        console.log(JSON.stringify(query))
        let filteredBlocks = await dbConnection.db("eth_db").collection("blocks").find(query, { projection: { "_id": 0, "number": 1 } }).toArray()
        let minBlock = filteredBlocks[filteredBlocks.length - 1].number
        let maxBlock = filteredBlocks[0].number;
        query = {
            $and: [{ blockNumber: { $gt: minBlock } }, { blockNumber: { $lt: maxBlock } }, { value: { $gt: parseFloat(minEth) } }]
        }
        let projections = {
            "projection": {
                "hash": 1,
                "value": 1,
                "blockNumber": 1,
                "transactionIndex": 1
            }
        }
        console.log(JSON.stringify(query))
        let filteredTransactions = await dbConnection.db("eth_db").collection("transactions").find(query, projections).limit(50).toArray();
        console.log(filteredTransactions)
        return filteredTransactions
    }
}

module.exports.getStats = async (timeUnit) => {
    let latestBlockDetails = await dbConnection.db("eth_db").collection('blocks').find().project({ "number": 1, "timestamp": 1 }).sort({ "number": -1 }).limit(1).toArray()
    let transactionStats = await dbConnection.db("eth_db").collection('transactions').stats()
    

    let timestamp = moment.unix(latestBlockDetails[0]["timestamp"]).subtract( timeUnit -1, 'days').startOf('day').unix();
    // console.log(timestamp)
    let blockNumber = await dbConnection.db("eth_db").collection('blocks').find({"timestamp": {"$gt" : timestamp}}).project({"number": 1}).sort({"number": 1}).limit(1).toArray()
    // console.log(blockNumber[0].number)
    let count = await dbConnection.db("eth_db").collection('transactions').count({"blockNumber": {"$gte" : blockNumber[0].number}})
    let transactionCount = transactionStats.count
    // console.log(latestBlockDetails)
    let daysSinceFirstBlock = moment.unix(latestBlockDetails[0]["timestamp"]).diff(moment.unix(ETH_FIRST_BLOCK_DATE), "days")
    // console.log(daysSinceFirstBlock, timeUnit, transactionCount, latestBlockDetails)
    let result = {
        avgNoOfBlocks: parseInt(latestBlockDetails[0]["number"] * timeUnit / daysSinceFirstBlock),
        avgNoTransactions: parseInt(transactionCount * timeUnit / daysSinceFirstBlock),
        totalNumberOfTransactions: count
    }
    // console.log(result)
    return result
}