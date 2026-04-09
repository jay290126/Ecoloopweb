const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { signToken } = require('../utils/jwt')

function publicUser(u) {
  return { id: String(u._id), username: u.username, email: u.email }
}

async function register(req, res) {
  const { username, email, password } = req.body || {}
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email, password are required' })
  }
  if (String(password).length < 4) {
    return res.status(400).json({ message: 'Password too short' })
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() })
  if (existing) return res.status(409).json({ message: 'Email already registered' })

  const hashed = await bcrypt.hash(String(password), 10)
  const user = await User.create({
    username: String(username).trim(),
    email: String(email).toLowerCase().trim(),
    password: hashed,
  })

  const token = signToken({ id: String(user._id) })
  return res.json({ token, user: publicUser(user) })
}

async function login(req, res) {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(String(password), user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const token = signToken({ id: String(user._id) })
  return res.json({ token, user: publicUser(user) })
}

module.exports = { register, login }

