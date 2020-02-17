const { getConnection } = require('../../lib/mongo');
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