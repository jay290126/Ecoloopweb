const express = require('express')
const { listProducts, createProduct } = require('../controllers/productController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/products', listProducts)
router.post('/products', auth, createProduct)

module.exports = router

