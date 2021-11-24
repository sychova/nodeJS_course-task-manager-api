const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const id = {
    toString: () => Date.now(),
}

const userFactory = {
    call(params) {
        return User.create({
            name: `Ana ${id}`,
            email: `a.sychova+${id}@example.com`,
            password: 'Qwerty1234',
            ...params,
        })
    },
}

const taskFactory = {
    call(params) {
        return Task.create({
            title: `Task#${id}`,
            ...params,
        })
    },
}

module.exports = {
    userFactory,
    taskFactory,
}
