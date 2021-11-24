const express = require('express')
const db = require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

db.connect(process.env.MONGODB_URL)

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
