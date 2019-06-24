const express = require('express')
const app = express()
const port = 3003
// 引用body-parser
const bodyParser = require('body-parser')

// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// 引用express-handlebars
const exphbs = require('express-handlebars')
// 告訴express使用handlebars作為template engine並預設layout為'main'
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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

// 設定路由
// Todo 首頁
app.get('/', (req, res) => {
    Todo.find((err, todos) => {
        // 把Todo model所有的資料都抓回來
        if (err) return console.error(err)
        return res.render('index', { todos: todos })
    })
})

// 列出全部 Todo
app.get('/todos', (req, res) => {
    res.send('列出所有 Todo')
})

// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
    return res.render('new')
})

// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (err) return console.error(err)
        return res.render('detail', { todo: todo })
    })
})

// 新增一筆  Todo
app.post('/todos', (req, res) => {
    const todo = new Todo({
        name: req.body.name
    })

    todo.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
    })
})

// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (err) return console.error(err)
        return res.render('edit', { todo: todo })
    })
})

// 修改 Todo
app.post('/todos/:id', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (err) return console.error(err)
        todo.name = req.body.name
        if (req.body.done === 'on') {
            todo.done = true
        } else {
            todo.done = false
        }
        todo.save(err => {
            if (err) return console.error(err)
            return res.redirect(`/todos/${req.params.id}`)
        })
    })
})

// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (err) return console.error(err)
        todo.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})


app.listen(port, () => {
    console.log('App is running...')
})