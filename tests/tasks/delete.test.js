const Task = require('../../src/models/task')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('DELETE /tasks/:id', () => {
    let user
    let task
    let subject

    describe('with correct request', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })

            subject = makeRequest({
                method: 'delete',
                path: `/tasks/${task.id}`,
                user,
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('returns deleting task', async () => {
            const { body } = await subject()
            expect(body).toEqual(toJSON(task))
        })

        it('deletes a user task', async () => {
            await subject()
            task = await Task.findById(task.id)
            expect(task).toBeNull()
        })
    })

    describe('authorization token is not passed', () => {
        beforeEach(async () => {
            task = await factories.taskFactory.call({ createdBy: user.id })

            subject = makeRequest({
                method: 'delete',
                path: `/tasks/${task.id}`,
            })
        })

        it('returns 401 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(401)
        })

        it('does not delete the task', async () => {
            await subject()
            task = await Task.findById(task.id)
            expect(task).not.toBeNull()
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual({
                error: 'Please authenticate.',
            })
        })
    })

    describe("with someone else's task id", () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            anotherUser = await factories.userFactory.call()
            task = await factories.taskFactory.call({
                createdBy: anotherUser.id,
            })

            subject = makeRequest({
                method: 'delete',
                path: `/tasks/${task.id}`,
                user,
            })
        })

        it('returns 404 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(404)
        })

        it('does not delete the task', async () => {
            await subject()
            task = await Task.findById(task.id)
            expect(task).not.toBeNull()
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual('')
        })
    })
})
