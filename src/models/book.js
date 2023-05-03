const { Decimal128 } = require('mongodb')
const mongoose = require('mongoose')

const Book = mongoose.model('Book', {
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false,
        default: 5
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cover: {
        type: Buffer
    }
})

module.exports = Book