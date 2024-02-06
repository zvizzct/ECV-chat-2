exports.setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado')

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })
  })
}

exports.renderChat = (req, res) => {
  res.render('chat')
}
