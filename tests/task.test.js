const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    user0Id,
    user0,
    user1Id,
    user1,
    task0,
    task1,
    task2,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send({
            title: 'Buy a box'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should not create task with invalid title', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(400)
})

test('Should return all tasks of user 0', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should fetch user task by id', async() => {
    await request(app)
        .get(`/tasks/${task0._id}`)
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not fetch user task by id if unauthenticated', async() => {
    await request(app)
        .get(`/tasks/${task0._id}`)
        .send()
        .expect(401)
})

test('Should not fetch other users task by id', async() => {
    await request(app)
        .get(`/tasks/${task2._id}`)
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should fetch only completed tasks', async() => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(1)
})

test('Should fetch only incomplete tasks', async() => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(1)
    console.log(response.body)
})

test('Should not update task with invalid title', async() => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send({
            title: ''
        }).expect(400)
    const task = await Task.findById(task1._id)
    expect(task.title).not.toBeNull()
})

test('Should not update other users task', async() => {
    await request(app)
        .patch(`/tasks/${task2._id}`)
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should delete user task', async() => {
    await request(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(task1._id)
    expect(task).toBeNull()
})

test('Should not allow deleting tasks that the user doesn\'t own', async() => {
    await request(app)
        .delete(`/tasks/${task0._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(task0._id)
    expect(task).not.toBeNull()
})

test('Should not delete task if unauthenticated', async() => {
    await request(app)
        .delete(`/tasks/${task1._id}`)
        .send()
        .expect(401)
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()
})
