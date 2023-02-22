const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Book = require('./models/book')
const { findByIdAndUpdate } = require('./models/user')
const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // this will automatically parse incomming json data into object
app.use(userRouter)
app.use(bookRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
