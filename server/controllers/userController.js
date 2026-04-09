const User = require('../models/User')

async function getProfile(req, res) {
  const user = await User.findById(req.user._id).select('-password')
  return res.json({
    user: { id: String(user._id), username: user.username, email: user.email },
  })
}

async function getWishlist(req, res) {
  const user = await User.findById(req.user._id).populate('wishlist')
  return res.json({ wishlist: user.wishlist || [] })
}

async function toggleWishlist(req, res) {
  const { productId } = req.params
  const user = await User.findById(req.user._id)
  const exists = user.wishlist.some((id) => String(id) === String(productId))

  if (exists) {
    user.wishlist = user.wishlist.filter((id) => String(id) !== String(productId))
    await user.save()
    return res.json({ wished: false })
  }

  user.wishlist.push(productId)
  await user.save()
  return res.json({ wished: true })
}

module.exports = { getProfile, getWishlist, toggleWishlist }

