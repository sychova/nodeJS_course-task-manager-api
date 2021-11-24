const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userTask0Id = new mongoose.Types.ObjectId()
const userTask0 = {
    _id: userTask0Id,
    name: 'Ana',
    email: 'a.sychovaTask0@gmail.com',
    password: 'Qwerty1234',
    tokens: [
        {
            token: jwt.sign({ _id: userTask0Id }, process.env.JWT_SECRET),
        },
    ],
}

const userTask1Id = new mongoose.Types.ObjectId()
const userTask1 = {
    _id: userTask1Id,
    name: 'Ana',
    email: 'a.sychovaTask1@example.com',
    password: 'Qwerty1234',
    tokens: [
        {
            token: jwt.sign({ _id: userTask1Id }, process.env.JWT_SECRET),
        },
    ],
}

const task0 = {
    _id: new mongoose.Types.ObjectId(),
    title: 'First Task',
    completed: false,
    createdBy: userTask0._id,
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Second Task',
    completed: true,
    createdBy: userTask0._id,
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Third Task',
    completed: false,
    createdBy: userTask1._id,
}

const setupTaskDatabase = async () => {
    await Task.deleteMany()
    await User.deleteMany()
    await new User(userTask0).save()
    await new User(userTask1).save()
    await new Task(task0).save()
    await new Task(task1).save()
    await new Task(task2).save()
}

module.exports = {
    userTask0Id,
    userTask0,
    userTask1Id,
    userTask1,
    task0,
    task1,
    task2,
    setupTaskDatabase,
}
