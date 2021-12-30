// C:\Users\User\mongodb\bin\mongod.exe --dbpath=C:\Users\User\mongodb-data

const util = require('util')
const mongoose = require('mongoose')

const OPTIONS = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}

mongooseConnect = util.promisify(mongoose.connect)

function connect(uri, options = {}) {
    return mongooseConnect(uri, { ...OPTIONS, ...options })
}

module.exports = {
    connect,
    mongoose,
}
