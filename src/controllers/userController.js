const bcrypt = require('bcryptjs')
const User = require('../models/user')

/**
 * Renders the registration form.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.registerForm = (req, res) => {
  res.render('register')
}

/**
 * Registers a new user in the system.
 * Processes the registration form, creating a new user with an encrypted password.
 * Redirects the user to the login page if the registration is successful,
 * or to the home page if the user already exists.
 * @param {Object} req - The HTTP request object, containing the form data.
 * @param {Object} res - The HTTP response object.
 */
exports.registerUser = async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const userExists = await User.findOne({ where: { nickname: username } })
    if (userExists) {
      return res.redirect('/')
    }

    await User.create({
      nickname: username,
      password: hashedPassword
    })

    res.redirect('/login')
  } catch (error) {
    console.error('Error registering the user:', error)
    res.redirect('/')
  }
}

/**
 * Renders the login form.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.loginForm = (req, res) => {
  res.render('login')
}

/**
 * Authenticates a user in the system.
 * Checks if the user exists and if the password is correct.
 * Sets the user data in the session and redirects to the chat page if the login is successful.
 * Redirects back to the login form if the user does not exist or the password is incorrect.
 * @param {Object} req - The HTTP request object, containing the login form data.
 * @param {Object} res - The HTTP response object.
 */
exports.loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ where: { nickname: username } })
    if (!user) {
      console.log('User not found')
      return res.redirect('/login')
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      console.log('Incorrect password')
      res.redirect('/login')
    } else {
      req.session.user = { id: user.user_id, username: user.nickname }
      res.redirect('/chat')
    }
  } catch (error) {
    console.error('Error logging in:', error)
    res.redirect('/login')
  }
}
