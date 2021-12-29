const Task = require('../../src/models/task')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('PATCH /tasks/:id', () => {
    let user
    let task
    let subject
    let payload

    describe('with correct request', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            payload = {
                title: 'Updated Title',
                completed: true,
            }

            subject = makeRequest({
                method: 'patch',
                path: `/tasks/${task.id}`,
                user,
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('updates a user task', async () => {
            const { body } = await subject()
            const updatedProps = {
                title: body.title,
                completed: body.completed,
            }
            expect(updatedProps).toEqual(toJSON(payload))
        })
    })

    describe('without title', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            payload = {
                title: '',
                completed: true,
            }

            subject = makeRequest({
                method: 'patch',
                path: `/tasks/${task.id}`,
                user,
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 400 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(400)
        })

        it('does not update a task with empty title', async () => {
            await subject()
            const updatedTask = await Task.findById(task.id)
            expect(updatedTask.title).not.toEqual('')
        })
    })

    describe('nonexistent property', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            payload = {
                location: 'Location',
            }

            subject = makeRequest({
                method: 'patch',
                path: `/tasks/${task.id}`,
                user,
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 400 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(400)
        })

        it('does not update a task with nonexistent property', async () => {
            await subject()
            const updatedTask = await Task.findById(task.id)
            expect(updatedTask.location).toBeNull
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual({ error: "Property doesn't exist." })
        })
    })

    describe("with someone else's task id", () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            anotherUser = await factories.userFactory.call()
            task = await factories.taskFactory.call({
                createdBy: anotherUser.id,
            })
            payload = {
                title: 'Updated Title',
                completed: true,
            }

            subject = makeRequest({
                method: 'patch',
                path: `/tasks/${task.id}`,
                user,
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 404 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(404)
        })

        it('task data is not updated', async () => {
            await subject()
            const caseTask = await Task.findById(task.id)
            const caseTaskProps = {
                title: caseTask.title,
                completed: caseTask.completed,
            }
            expect(caseTaskProps).not.toEqual(toJSON(payload))
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual('')
        })
    })

    describe('authorization token is not passed', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            task = await factories.taskFactory.call({ createdBy: user.id })
            payload = {
                title: 'Updated Title',
                completed: true,
            }

            subject = makeRequest({
                method: 'patch',
                path: `/tasks/${task.id}`,
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 401 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(401)
        })

        it('task data is not updated', async () => {
            await subject()
            const caseTask = await Task.findById(task.id)
            const caseTaskProps = {
                title: caseTask.title,
                completed: caseTask.completed,
            }
            expect(caseTaskProps).not.toEqual(toJSON(payload))
        })

        it('returns error value', async () => {
            const { body } = await subject()
            expect(body).toEqual({
                error: 'Please authenticate.',
            })
        })
    })
})
