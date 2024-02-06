const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const { setupWebSocket } = require('./src/controllers/chatController')
const userRoutes = require('./src/routes/user')
const chatRoutes = require('./src/routes/chat')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

setupWebSocket(io)

global.users = []

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
)

// Rutas
app.use(express.static('public'))
app.use('/', userRoutes)
app.use('/chat', chatRoutes)

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
