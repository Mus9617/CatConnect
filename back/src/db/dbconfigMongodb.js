const { MongoClient, Db } = require('mongodb')

var client = null

function connect(url, callback) {
    if (client === null) {
        client = new MongoClient(url)
        client.connect((error) => {
            if (error) {
                client = null
                callback(error)
            } else {
                callback()
            }
        })
    } else {
        callback()
    }
}

function db(dbName) {
    return new Db(client, dbName)
}

function closeConnect() {
    if (client) {
        client.close()
        client = null
    }
}

connect(process.env.MONGO_URL, (error) => {
    if (error) {
        console.log('connexion échoué')
        process.exit(-1)
    } else {
        console.log('connexion reussi')
    }
})

module.exports = { connect, db, closeConnect, client}