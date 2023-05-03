const express = require('express')
const router = new express.Router()
const Book = require('../models/book')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const e = require('express')

router.post('/books/create-book', auth, async (req, res) => {
    const book = new Book({
        ...req.body,
        created_by: req.user._id
    })
    
    try {
        await book.save()
        return res.status(201).send(book)
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.get('/books', async (req, res) => {
    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6;

    let query = {}
    if (req.query.name) {
        query.name = req.query.name;
    } else {
        query.name = ""
    }
    
    try {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const countPromise = Book.countDocuments({ "name": { "$regex": query.name, "$options": "i" } });

        const booksPromise = Book.find({ "name": { "$regex": query.name, "$options": "i" } })
        .limit(ITEMS_PER_PAGE)
        .skip(skip);

        const [count, books] = await Promise.all([countPromise, booksPromise])
        const pageCount = count / ITEMS_PER_PAGE;
        const data = {
            pagination: {
                count,
                pageCount: Math.ceil(pageCount)
            },
            books
        }

        res.status(200).send(data)

    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/books/user', auth, async (req, res) => {
    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6;

    let query = {}
    if (req.query.name) {
        query.name = req.query.name;
    } else {
        query.name = ""
    }
    
    try {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const countPromise = Book.countDocuments({created_by: req.user._id, "name": { "$regex": query.name, "$options": "i" }});
        const booksPromise = Book.find({created_by: req.user._id, "name": { "$regex": query.name, "$options": "i" }})
        .limit(ITEMS_PER_PAGE)
        .skip(skip);

        const [count, books] = await Promise.all([countPromise, booksPromise])
        const pageCount = count / ITEMS_PER_PAGE;
        const data = {
            pagination: {
                count,
                pageCount: Math.ceil(pageCount)
            },
            books
        }

        res.status(200).send(data)

    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/books/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const book = await Book.findOne({_id})

        if (!book) {
            return res.status(404).send()
        }
        return res.status(200).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/books/edit-book/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description']
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

router.delete('/books/delete/:id', auth, async (req, res) => {
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

router.post('/books/vote/:id', auth, async (req, res) => {
    _id = req.params.id
    vote = Number(req.body.vote)

    try {
        const book = await Book.findOne({_id})
        if (vote > 10 || vote < 1) {
            return res.status(400).send({error: 'Please enter a number between 1 and 10'})
        }

        book.rating = (book.rating + vote) / 2
        book.save()
        if (!book) {
            res.status(404).send({error: 'Book not found'})
        }
        res.status(200).send()
    }
    catch (e) {
        res.status(400).send(e)
    }
})

const upload = multer({
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

router.post('/books/:id/cover', auth, upload.single('file'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    const _id = req.params.id

    const book = await Book.findById({_id})
    book.cover = buffer
    await book.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
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