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

test('Should return all tasks of user 0', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user0.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not allow deleting tasks that the user doesn\'t own', async() => {
    const response = await request(app)
        .delete(`/tasks/${task0._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(task0._id)
    expect(task).not.toBeNull()
})