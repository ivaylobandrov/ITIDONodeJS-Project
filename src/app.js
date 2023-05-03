const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const cors = require('cors');

const app = express()

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(bookRouter)

module.exports = app