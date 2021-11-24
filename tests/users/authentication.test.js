const User = require('../../src/models/user')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('POST /users/login', () => {
    let user
    let subject

    describe('with correct request', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()

            subject = makeRequest({
                method: 'post',
                path: '/users/login',
                payload: {
                    email: user.email,
                    password: 'Qwerty1234',
                },
            })
        })

        it('returns 200 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(200)
        })

        it('the user is logged in', async () => {
            const { body } = await subject()
            const loggedInUser = await User.findById(user._id)
            expect(body.token).toEqual(
                loggedInUser.tokens[loggedInUser.tokens.length - 1].token
            )
        })
    })

    describe('nonexistent user', () => {
        beforeEach(async () => {
            subject = makeRequest({
                method: 'post',
                path: '/users/login',
                payload: {
                    email: 'nonexistentemail',
                    password: 'nonexistnetpass',
                },
            })
        })

        it('returns 400 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(400)
        })
    })
})
