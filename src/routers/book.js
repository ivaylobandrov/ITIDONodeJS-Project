const express = require('express')
const router = new express.Router()
const Book = require('../models/book')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { findById } = require('../models/book')

router.post('/books', auth, async (req, res) => {
    const book = new Book({
        ...req.body,
        created_by: req.user._id
    })
    
    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/books', auth, async (req, res) => {
    const { name, page = 1, limit = 3 } = req.query
    const filter = {}
    if (name) {
        filter.name = name
    }
    
    try {
        const books = await Book.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
        const count = await Book.countDocuments()
        res.status(200).send({books, totalPages: Math.ceil(count / limit), currentPage: page})

    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/books/:id', auth, async (req, res) => {
    _id = req.params.id

    try {
        const book = await Book.findOne({_id, created_by: req.user._id})

        if (!book) {
            res.status(404).send()
        }
        res.status(200).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/books/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'rating']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    _id = req.params.id

    try {
        const book = await Book.findOne({_id: req.params.id, created_by: req.user._id})

        if (!book) {
            return res.status(404).send()
        }

        updates.forEach((update) => book[update] = req.body[update])
        await book.save()
        res.status(200).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/books/:id', auth, async (req, res) => {
    _id = req.params.id

    try {
        const book = await Book.findByIdAndDelete({_id: req.params.id, created_by: req.user._id})
        if (!book) {
            res.status(404).send({error: 'Book not found'})
        }
        res.status(200).send()
    }
    catch (e) {
        res.status(400).send(e)
    }
})

const cover = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/books/:id/cover', auth, cover.single('cover'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    const _id = req.params.id

    const book = await Book.findOne({_id, created_by: req.user._id})
    book.cover = buffer
    await book.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/books/:id/cover', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book || !book.cover) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(book.cover)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router