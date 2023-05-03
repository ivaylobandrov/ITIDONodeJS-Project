const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const Book = require('../src/models/book')

const userTwoId = new mongoose.Types.ObjectId()
const bookOneId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'gosho1',
    email: 'gosho1@email.com',
    password: 'samolevski',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const bookOne = {
    _id: bookOneId,
    name: 'Long Time Ago 2',
    description: 'Unexpected journey 2',
    created_by: userTwo._id,
}

beforeEach(async () => {
    await User.deleteMany()
    await Book.deleteMany()
    await new User(userTwo).save()

    await new Book(bookOne).save()
})

test('Should get all books', async () => {
    await request(app).get('/books')
    .send()
    .expect(200)
})

test('Should get book details', async () => {
    await request(app).get(`/books/${bookOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should get all users books', async () => {
    await request(app).get('/books/user')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should create a book', async () => {
    await request(app).post('/books/create-book')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
        name: 'This is my new book',
        description: 'My new books descriotion'
    })
    .expect(201)
})