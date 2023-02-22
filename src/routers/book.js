const express = require('express')
const router = new express.Router()
const Book = require('../models/book')

router.post('/books', async (req, res) => {
    const book = new Book(req.body)
    
    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/books', async (req, res) => {
    
    try {
        const books = await Book.find({})
        res.status(200).send(books)
    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/books/:id', async (req, res) => {
    _id = req.params.id

    try {
        const book = await Book.findById(_id)
        if (!book) {
            res.status(404).send()
        }
        res.status(200).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/books/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'rating']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    _id = req.params.id

    try {
        const book = await Book.findById(req.params.id)

        updates.forEach((update) => book[update] = req.body[update])

        await book.save()

        if (!book) {
            return res.status(404).send()
        }
        res.status(200).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/books/:id', async (req, res) => {
    _id = req.params.id

    try {
        const book = await Book.findByIdAndDelete(_id)
        if (!book) {
            res.status(404).send({error: 'Book not found'})
        }
        res.status(200).send()
    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router