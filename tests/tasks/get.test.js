const Task = require('../../src/models/task')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('GET /tasks', () => {
    let user
    let task
    let subject

    describe('all user tasks', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            anotherTask = await factories.taskFactory.call({
                createdBy: user.id,
            })

            subject = makeRequest({
                method: 'get',
                path: `/tasks`,
                user,
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('returns all tasks of the user', async () => {
            const { body } = await subject()
            expect(body).toHaveLength(2)
        })
    })

    describe('user tasks by id', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })

            subject = makeRequest({
                method: 'get',
                path: `/tasks/${task.id}`,
                user,
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('returns requested task', async () => {
            const { body } = await subject()
            expect(body).toEqual(toJSON(task))
        })
    })

    describe('only completed tasks', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            anotherTask = await factories.taskFactory.call({
                completed: true,
                createdBy: user.id,
            })

            subject = makeRequest({
                method: 'get',
                path: `/tasks?completed=true`,
                user,
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('returns requested task', async () => {
            const { body } = await subject()
            expect(body).toHaveLength(1)
        })
    })

    describe('only incomplete tasks', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            anotherTask = await factories.taskFactory.call({
                completed: true,
                createdBy: user.id,
            })

            subject = makeRequest({
                method: 'get',
                path: `/tasks?completed=false`,
                user,
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('returns requested task', async () => {
            const { body } = await subject()
            expect(body[0]._id).toEqual(task.id)
        })
    })

    describe('authorization token is not passed', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })

            subject = makeRequest({
                method: 'get',
                path: `/tasks`,
            })
        })

        it('returns 404 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(401)
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual({
                error: 'Please authenticate.',
            })
        })
    })

    describe("someone else's task", () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            anotherUser = await factories.userFactory.call()
            task = await factories.taskFactory.call({
                createdBy: anotherUser.id,
            })

            subject = makeRequest({
                method: 'get',
                path: `/tasks/${task.id}`,
                user,
            })
        })

        it('returns 404 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(404)
        })

        it('does not return the task', async () => {
            const { body } = await subject()
            expect(body).toEqual({})
        })
    })
})
