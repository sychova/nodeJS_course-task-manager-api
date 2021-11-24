const User = require('../../src/models/user')
const { makeRequest, factories, toJSON } = require('../helpers')

describe('POST /users', () => {
    let user
    let subject
    let payload

    describe('with correct request', () => {
        beforeEach(async () => {
            payload = {
                name: 'Anastasiya',
                email: `a.sychova${Date.now().toString()}@example.com`,
                password: 'Qwerty1234',
            }

            subject = makeRequest({
                method: 'post',
                path: '/users',
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 201 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(201)
        })

        it('the user is registered', async () => {
            const { body } = await subject()
            user = await User.findById(body.user._id)
            expect(user).not.toBeNull()
        })

        it('registration data is preserved', async () => {
            const { body } = await subject()
            delete payload.password
            expect(body.user).toMatchObject(payload)
        })

        it('password is hashed', async () => {
            const { body } = await subject()
            user = await User.findById(body.user._id)
            expect(user.password).not.toBe('Qwerty1234')
        })
    })

    describe('with duplicate email', () => {
        beforeEach(async () => {
            user = await factories.userFactory.call()
            payload = {
                name: 'Anastasiya',
                email: user.email,
                password: 'Qwerty1234',
            }

            subject = makeRequest({
                method: 'post',
                path: '/users',
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 400 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(400)
        })

        it('returns 11000 db error code', async () => {
            const { error } = await subject()
            const errorCode = JSON.parse(error.text).code
            expect(errorCode).toBe(11000)
        })
    })

    describe('without name', () => {
        beforeEach(async () => {
            payload = {
                email: `a.sychova${Date.now().toString()}@example.com`,
                password: 'Qwerty1234',
            }

            subject = makeRequest({
                method: 'post',
                path: '/users',
                payload: {
                    ...payload,
                },
            })
        })

        it('returns 400 response status code', async () => {
            const { status } = await subject()
            expect(status).toBe(400)
        })

        it('returns error message', async () => {
            const { error } = await subject()
            const errorMessage = JSON.parse(error.text).message
            expect(errorMessage).toBe(
                'User validation failed: name: Path `name` is required.'
            )
        })
    })
})
