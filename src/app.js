const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')
const { setupWebSocket } = require('./controllers/chatController')
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Importar modelos
require('./models/associateModels')

// conf sesion
const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
})

// middleware para la sesion
app.use(sessionMiddleware)

// compartir la sesion con socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next)
})

// llamar a la funcion de socket.io para el chat
setupWebSocket(io)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json());

// Rutas
app.use(express.static('public'))
app.use('/', userRoutes)
app.use('/chat', chatRoutes)

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
