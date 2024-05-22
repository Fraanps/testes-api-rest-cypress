// arquivo principal que dá as funções de conexão com o banco de dados

const { MongoClient } = require('mongodb')

const mongoUri = 'mongodb+srv://qaex:20150210@cluster0.t9o48tu.mongodb.net/markdb?retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(mongoUri)


async function connect(){
    client.connect()
    return client.db('markdb')
}

async function disconnect(){
    await client.disconnect()
}

module.exports = {connect, disconnect}



