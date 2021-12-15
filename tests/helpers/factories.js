const User = require('../../src/models/user')
const Task = require('../../src/models/task')

let sequence = 0
const seq = {
    toString: () => `${process.env.JEST_WORKER_ID}-${sequence++}`,
}

const userFactory = {
    call(params) {
        return User.create({
            name: `Ana ${seq}`,
            email: `a.sychova+${seq}@example.com`,
            password: 'Qwerty1234',
            ...params,
        })
    },
}

const taskFactory = {
    call(params) {
        return Task.create({
            title: `Task#${seq}`,
            completed: false,
            ...params,
        })
    },
}

module.exports = {
    userFactory,
    taskFactory,
}
