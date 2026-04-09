const express = require('express')
const { auth } = require('../middleware/auth')
const { getProfile, getWishlist, toggleWishlist } = require('../controllers/userController')

const router = express.Router()

router.get('/profile', auth, getProfile)
router.get('/wishlist', auth, getWishlist)
router.post('/wishlist/:productId', auth, toggleWishlist)

module.exports = router

