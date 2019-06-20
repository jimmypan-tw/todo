const express = require('express')
const app = express()
const port = 3003
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/todo', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected.')
})

const Todo = require('./models/todo')

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(port, () => {
    console.log('App is running...')
})