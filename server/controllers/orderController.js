const { nanoid } = require('nanoid')
const Order = require('../models/Order')
const Product = require('../models/Product')

function newOrderId() {
  return `ECO-${nanoid(10).toUpperCase()}`
}

async function createOrder(req, res) {
  const { productId, address, paymentMethod } = req.body || {}
  if (!productId || !address || !paymentMethod) {
    return res
      .status(400)
      .json({ message: 'productId, address, paymentMethod are required' })
  }

  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  const required = ['fullName', 'addressLine', 'city', 'pincode', 'phone']
  for (const k of required) {
    if (!address?.[k]) return res.status(400).json({ message: `Missing address.${k}` })
  }

  if (!['COD', 'UPI'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Invalid paymentMethod' })
  }

  // Ensure unique orderId (rare collision)
  let orderId = newOrderId()
  // eslint-disable-next-line no-constant-condition
  while (await Order.findOne({ orderId })) {
    orderId = newOrderId()
  }

  const order = await Order.create({
    orderId,
    userId: req.user._id,
    productId: product._id,
    address: {
      fullName: String(address.fullName).trim(),
      addressLine: String(address.addressLine).trim(),
      city: String(address.city).trim(),
      pincode: String(address.pincode).trim(),
      phone: String(address.phone).trim(),
    },
    paymentMethod,
    status: 'Pending',
  })

  return res.status(201).json({ order })
}

async function listOrders(req, res) {
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('productId')
  return res.json({ orders })
}

module.exports = { createOrder, listOrders }

