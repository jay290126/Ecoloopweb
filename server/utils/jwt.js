const jwt = require('jsonwebtoken')

function signToken(payload) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET in environment')
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

module.exports = { signToken }

