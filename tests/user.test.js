const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'gosho',
    email: 'gosho@email.com',
    password: 'samolevski',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users')
    .send({
        name: 'petkan123',
        email: 'petkan123@email.com',
        password: 'samolevski'
    })
    .expect(201)
})

test('Should not login with incorrect credentials', async () => {
    await request(app).post('/users/login')
    .send({
        email: "nepoznat@email.com",
        password: "bezparola"
    })
    .expect(400)
})

test('Should get user details', async () => {
    await request(app).get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})