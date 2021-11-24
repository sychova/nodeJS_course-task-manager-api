const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

router.post('/tasks', auth, async(req, res) => {
    const task = new Task({
        ...req.body,
        createdBy: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET /tasks?completed=???
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, createdBy: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Property doesn\'t exist.' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image document.'))
        }
        callback(undefined, true)
    }
})

router.post('/tasks/:id/logo', auth, upload.single('logo'), async(req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        task.logo = buffer
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
}, (error, req, res, next) => {
    res.status(500).send({ error: error.message })
})

router.delete('/tasks/:id/logo', auth, async(req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        task.logo = undefined
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router