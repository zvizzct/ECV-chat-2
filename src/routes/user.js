const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/', UserController.registerForm)
router.post('/', UserController.registerUser)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.loginUser)

module.exports = router
