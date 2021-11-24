const User = require('../../src/models/user')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('PATCH /users/me', () => {
    let user
    let subject

    describe('with correct request', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'patch',
                path: '/users/me',
                user,
                payload: {
                    name: 'AnastasiyaUpdated',
                },
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('updates the user', async () => {
            await subject()
            const updatedUser = await User.findById(user._id)
            expect(updatedUser.name).toEqual('AnastasiyaUpdated')
        })
    })

    describe('authorization token is not passed', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'patch',
                path: '/users/me',
                payload: {
                    name: 'AnastasiyaUpdated',
                },
            })
        })

        it('returns 401 status code', async () => {
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
})
