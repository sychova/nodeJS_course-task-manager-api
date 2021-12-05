const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userTask0Id,
    userTask0,
    userTask1Id,
    userTask1,
    task0,
    task1,
    task2,
    setupTaskDatabase
} = require('./fixtures/tasksDB')

beforeEach(setupTaskDatabase)

describe('Creating tasks', () => {
    describe('Should do', () => {
        it('Creates task for user', async() => {
            const response = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send({
                    title: 'Buy a box'
                })
                .expect(201)
            const task = await Task.findById(response.body._id)
            expect(task).not.toBeNull()
            expect(task.completed).toBe(false)
        })
    })
    describe('Should not do', () => {
        it('Should not create task with invalid title', async() => {
            await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send({
                    completed: true
                })
                .expect(400)
        })
    })
})

describe('Getting tasks', () => {
    describe('Should do', () => {
        it('Returns all tasks of user 0', async() => {
            const response = await request(app)
                .get('/tasks')
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(200)
            expect(response.body.length).toEqual(2)
        })
        
        it('Fetches user task by id', async() => {
            await request(app)
                .get(`/tasks/${task0._id}`)
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(200)
        })
        it('Fetches only completed tasks', async() => {
            const response = await request(app)
                .get('/tasks?completed=true')
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(200)
            expect(response.body).toHaveLength(1)
        })
        
        it('Fetches only incomplete tasks', async() => {
            const response = await request(app)
                .get('/tasks?completed=false')
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(200)
            expect(response.body).toHaveLength(1)
        })
    })
    describe('Should not do', () => {
        it('Should not fetch user task by id if unauthenticated', async() => {
            await request(app)
                .get(`/tasks/${task0._id}`)
                .send()
                .expect(401)
        })
        
        it('Should not fetch other users task by id', async() => {
            await request(app)
                .get(`/tasks/${task2._id}`)
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(404)
        })
    })
})

describe('Updating tasks', () => {
    describe('Should not do', () => {
        it('Should not update task with invalid title', async() => {
            await request(app)
                .patch(`/tasks/${task1._id}`)
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send({
                    title: ''
                }).expect(400)
            const task = await Task.findById(task1._id)
            expect(task.title).toBeTruthy()
        })
        
        it('Should not update other users task', async() => {
            await request(app)
                .patch(`/tasks/${task2._id}`)
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(404)
        })
    })
})

describe('Deleting tasks', () => {
    describe('Should do', () => {
        it('Deletes user task', async() => {
            await request(app)
                .delete(`/tasks/${task1._id}`)
                .set('Authorization', `Bearer ${userTask0.tokens[0].token}`)
                .send()
                .expect(200)
            const task = await Task.findById(task1._id)
            expect(task).toBeNull()
        })
    })
    describe('Should not do', () => {
        it('Should not allow deleting tasks that the user doesn\'t own', async() => {
            await request(app)
                .delete(`/tasks/${task0._id}`)
                .set('Authorization', `Bearer ${userTask1.tokens[0].token}`)
                .send()
                .expect(404)
            const task = await Task.findById(task0._id)
            expect(task).not.toBeNull()
        })
        
        it('Should not delete task if unauthenticated', async() => {
            await request(app)
                .delete(`/tasks/${task1._id}`)
                .send()
                .expect(401)
            const task = await Task.findById(task1._id)
            expect(task).not.toBeNull()
        })
    })
})
