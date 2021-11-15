// C:\Users\User\mongodb\bin\mongod.exe --dbpath=C:\Users\User\mongodb-data

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})