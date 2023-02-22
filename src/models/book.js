const mongoose = require('mongoose')

const Book = mongoose.model('Book', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false
    }
})

module.exports = Book