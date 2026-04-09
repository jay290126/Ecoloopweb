const express = require('express')
const { createOrder, listOrders } = require('../controllers/orderController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/order', auth, createOrder)
router.get('/orders', auth, listOrders)

module.exports = router

