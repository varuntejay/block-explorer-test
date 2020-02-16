const { getConnection } = require('../../lib/mongo');
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
            $and: [{ blockNumber: { $gt: minBlock } }, { blockNumber: { $lt: maxBlock } }, { value: { $gt: minEth } }]
        }
        let projections = {
            "projection": {
                "from": 1,
                "to": 1,
                "_id": -1,
                "value": 1,
                "blockNumber": 1,
                "transactionIndex": 1
            }
        }
        console.log(JSON.stringify(query))
        let filteredTransactions = await dbConnection.db("eth_db").collection("transactions").find(query, projections).limit(5).toArray();
        console.log(filteredTransactions)
        return filteredTransactions
    }
}