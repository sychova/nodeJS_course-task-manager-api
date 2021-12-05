const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { 
    user0Id,
    user0,
    user1Id,
    user1,
    setupUserDatabase
} = require('./fixtures/usersDB')

beforeEach(setupUserDatabase)

describe('User signup', () => {
    describe('Should do', () => {
        it('Should signup a new user', async() => {
            const response = await request(app)
            .post('/users')
            .send({
                name: 'Anastasiya',
                email: 'a.sychova@sumatosoft.com',
                password: 'Qwerty1234'
            })
            .expect(201)

            const user = await User.findById(response.body.user._id)
            expect(user).not.toBeNull()

            expect(response.body).toMatchObject({
                user: {
                    name: 'Anastasiya',
                    email: 'a.sychova@sumatosoft.com'
                },
                token: user.tokens[0].token
            })
            expect(user.password).not.toBe('Qwerty1234')
        })
    })
})

describe('User login', () => {
    describe('Should do', () => {
        test('Should login existing user', async() => {
            const response = await request(app)
            .post('/users/login')
            .send({
                email: user0.email,
                password: user0.password
            })
            .expect(200)
            const user = await User.findById(user0Id)
            expect(response.body.token).toBe(user.tokens[1].token)
        })
    })
    describe('Should not do', () => {
        test('Should not login nonexistent user', async() => {
            await request(app)
            .post('/users/login')
            .send({
                email: 'qqqqq@qqqqqq.qqqqq',
                password: 'qqqqqqqq'
            })
            .expect(400)
        })
    })
})

describe('Getting Users', () => {
    describe('Should do', () => {
        test('Should get profile for user', async() => {
            await request(app)
                .get('/users/me')
                .set('Authorization', `Bearer ${user0.tokens[0].token}`)
                .send()
                .expect(200)
        })
    })
    describe('Should not do', () => {
        test('Should not get profile for unauthenticated user', async() => {
            await request(app)
                .get('/users/me')
                .send()
                .expect(401)
        })
    })
})

describe('Updating Users', () => {
    describe('Should do', () => {
        test('Should upload avatar image', async() => {
            await request(app)
                .post('/users/me/avatar')
                .set('Authorization', `Bearer ${user0.tokens[0].token}`)
                .attach('avatar', 'tests/fixtures/profile-pic.jpg')
                .expect(200)
            const user = await User.findById(user0Id)
            expect(user.avatar).toEqual(expect.any(Buffer))
        })
        
        test('Should update valid user fields', async() => {
            await request(app)
                .patch('/users/me')
                .set('Authorization', `Bearer ${user0.tokens[0].token}`)
                .send({
                    name: 'Anastasiya'
                })
                .expect(200)
            const user = await User.findById(user0Id)
            expect(user.name).toEqual('Anastasiya')
        })
    })
    describe('Should not do', () => {
        test('Should not update invalid user fields', async() => {
            await request(app)
                .patch('/users/me')
                .set('Authorization', `Bearer ${user0.tokens[0].token}`)
                .send({
                    location: 'Minsk'
                })
                .expect(400)
        })
    })
})

describe('Deleting Users', () => {
    describe('Should do', () => {
        test('Should delete account for user', async() => {
            const response = await request(app)
                .delete('/users/me')
                .set('Authorization', `Bearer ${user1.tokens[0].token}`)
                .send()
                .expect(200)
            const user = await User.findById(response.body._id)
            expect(user).toBeNull()
        })
    })
    describe('Should not do', () => {
        test('Should not delete account for unauthenticated user', async() => {
            await request(app)
                .delete('/users/me')
                .send()
                .expect(401)
        })
    })
})
