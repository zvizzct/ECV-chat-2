const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.get('/', chatController.renderChat)

router.get('/:roomName', chatController.renderChatRoom)

module.exports = router
