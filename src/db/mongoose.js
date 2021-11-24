// C:\Users\User\mongodb\bin\mongod.exe --dbpath=C:\Users\User\mongodb-data

const mongoose = require('mongoose')

const OPTIONS = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}

function connect(uri, options = {}) {
    return new Promise((resolve) =>
        mongoose.connect(uri, { ...OPTIONS, ...options }, () => {
            console.debug('DB is connected')
            resolve()
        })
    )
}

module.exports = {
    connect,
    mongoose,
}
