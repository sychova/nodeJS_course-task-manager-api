const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { user0Id, user0, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async() => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Anastasiya',
            email: 'a.sychova@sumatosoft.com',
            password: 'Qwerty1234'
        }).expect(201)

    // Assert db changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    // expect(response.body.user.name).toBe('Anastasiya')
    expect(response.body).toMatchObject({
        user: {
            name: 'Anastasiya',
            email: 'a.sychova@sumatosoft.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Qwerty1234')
})

test('Should not signup user with invalid email', async() => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Anastasiya',
            email: user0.email,
            password: user0.password
        }).expect(400)
})

test('Should not signup user with invalid password', async() => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Anastasiya',
            email: 'a.sychova@sumatosoft.com',
            password: 'password'
        }).expect(400)
})

test('Should login existing user', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: user0.email,
            password: user0.password
        }).expect(200)
    const user = await User.findById(user0Id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async() => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'qqqqq@qqqqqq.qqqqq',
            password: 'qqqqqqqq'
        }).expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

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

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send({
            location: 'Minsk'
        })
        .expect(400)
})

test('Should not update user with invalid email', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send({
            email: 'anastasiya.sychova@example.com'
        }).expect(400)
})

test('Should not update user with invalid password', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send({
            password: 'password'
        }).expect(400)
})

test('Should not update user if unauthenticated', async() => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Minsk'
        }).expect(401)
})