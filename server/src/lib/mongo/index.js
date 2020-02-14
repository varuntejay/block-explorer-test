const { MongoClient } = require('mongodb');
const { MONGODB_PROVIDER } = require('../../globalconfig');;

class DBConnector {
    constructor() {
        this.mongoInstance;
        this.provider = MONGODB_PROVIDER;
    }

    getConnection() {
        return new Promise(async (resolve, reject) => {
            if (!this.mongoInstance) {
                this.mongoInstance = await MongoClient.connect(this.provider);
                resolve(this.mongoInstance)
            } else {
                resolve(this.mongoInstance)
            }
        })
    }
}

module.exports.getConnection = () => {
    return new Promise((resolve, reject) => {
        const dbConnector = new DBConnector(MONGODB_PROVIDER);
        dbConnector.getConnection()
        .then((dbConnection) => {
            // console.log(dbConnection)
            resolve (dbConnection);
        })
    })
}