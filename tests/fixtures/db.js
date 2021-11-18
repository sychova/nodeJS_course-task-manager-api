const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user0Id = new mongoose.Types.ObjectId()
const user0 = {
    _id: user0Id,
    name: 'Ana',
    email: 'anastasiya.sychova@gmail.com',
    password: 'Qwerty1234',
    tokens: [{
        token: jwt.sign({ _id: user0Id }, process.env.JWT_SECRET)
    }]
}

const user1Id = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1Id,
    name: 'Ana',
    email: 'anastasiya.sychova@example.com',
    password: 'Qwerty1234',
    tokens: [{
        token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET)
    }]
}

const task0 = {
    _id: new mongoose.Types.ObjectId(),
    title: 'First Task',
    completed: false,
    createdBy: user0._id
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Second Task',
    completed: true,
    createdBy: user0._id
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Third Task',
    completed: false,
    createdBy: user1._id
}

const setupDatabase = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user0).save()
    await new User(user1).save()
    await new Task(task0).save()
    await new Task(task1).save()
    await new Task(task2).save()
}

module.exports = {
    user0Id,
    user0,
    user1Id,
    user1,
    task0,
    task1,
    task2,
    setupDatabase
}