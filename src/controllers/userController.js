const bcrypt = require('bcryptjs')

exports.registerForm = (req, res) => {
  res.render('register')
}

exports.registerUser = async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  const userExists = users.find((user) => user.username === username)
  if (userExists) {
    return res.redirect('/register')
  }
  console.log(username, password, hashedPassword)
  users.push({ username, password: hashedPassword })
  res.redirect('/login')
}

exports.loginForm = (req, res) => {
  res.render('login')
}

exports.loginUser = async (req, res) => {
  const { username, password } = req.body
  const user = users.find((user) => user.username === username)

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user
    return res.redirect('/chat')
  }

  res.redirect('/login')
}
