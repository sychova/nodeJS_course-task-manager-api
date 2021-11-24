const Task = require('../../src/models/task')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('POST /tasks', () => {
    let user
    let task
    let subject

    describe('with correct request', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'post',
                path: `/tasks`,
                user,
                payload: {
                    title: 'Go to sleep',
                },
            })
        })

        it('returns 201 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(201)
        })

        it('creates a user task', async () => {
            const { body } = await subject()
            task = await Task.findById(body._id)
            expect(task).not.toBeNull()
        })

        it('sets default status correctly', async () => {
            const { body } = await subject()
            expect(body.completed).toBeFalsy()
        })
    })

    describe('without title', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'post',
                path: `/tasks`,
                user,
                payload: {
                    completed: true,
                },
            })
        })

        it('returns 400 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(400)
        })

        it('does not create task without title', async () => {
            await subject()
            const task = await Task.find({ title: '' })
            expect(task).toHaveLength(0)
        })
    })

    describe('authorization token is not passed', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'post',
                path: `/tasks`,
            })
        })

        it('returns 401 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(401)
        })

        it('does not create the task', async () => {
            await subject()
            task = await Task.find({ createdBy: user.id })
            expect(task).toHaveLength(0)
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual({
                error: 'Please authenticate.',
            })
        })
    })
})
