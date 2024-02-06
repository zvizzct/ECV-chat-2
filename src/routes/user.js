const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/register', UserController.registerForm)
router.post('/register', UserController.registerUser)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.loginUser)

module.exports = router
