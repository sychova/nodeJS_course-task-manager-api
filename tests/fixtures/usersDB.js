const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

const user0Id = new mongoose.Types.ObjectId()
const user0 = {
    _id: user0Id,
    name: 'Ana',
    email: 'a.sychova0@example.com',
    password: 'Qwerty1234',
    tokens: [
        {
            token: jwt.sign({ _id: user0Id }, process.env.JWT_SECRET),
        },
    ],
}

const user1Id = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1Id,
    name: 'Ana',
    email: 'a.sychova1@example.com',
    password: 'Qwerty1234',
    tokens: [
        {
            token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET),
        },
    ],
}

const setupUserDatabase = async () => {
    await User.deleteMany()
    await new User(user0).save()
    await new User(user1).save()
}

module.exports = {
    user0Id,
    user0,
    user1Id,
    user1,
    setupUserDatabase,
}
