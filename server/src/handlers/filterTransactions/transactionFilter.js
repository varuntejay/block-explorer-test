const { getConnection } = require('../../lib/mongo');
let dbConnection;
getConnection()
    .then((result) => {
        dbConnection = result;
    });
module.exports.getFilteredTransactions = async (filterParams) => {
    if (filterParams.endTime) {
        let endTime = filterParams.endTime;
        let startTime = filterParams.startTime || endTime - 86400;
        let query = {
            $and: [{ timestamp: { $gt: startTime } }, { timestamp: { $lt: endTime } }]
        }
        let filteredBlocks = await dbConnection.db("eth_db").collection("blocks").find(query, { projection: { "_id": 0, "number": 1 } })
        return filteredBlocks
    }
}