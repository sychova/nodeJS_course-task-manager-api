const User = require('../../src/models/user')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('DELETE /users/me', () => {
    let user
    let subject

    describe('with correct request', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'delete',
                path: '/users/me',
                user,
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('returns deleting user', async () => {
            const { body } = await subject()
            expect(body).toEqual(toJSON(user))
        })

        it('deletes the user', async () => {
            const { body } = await subject()
            const user = await User.findById(body._id)
            expect(user).toBeNull()
        })
    })

    describe('authorization token is not passed', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'delete',
                path: '/users/me',
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
