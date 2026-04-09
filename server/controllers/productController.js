const Product = require('../models/Product')
const User = require('../models/User')
const { cloudinary } = require('../config/cloudinary')

async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 })
  return res.json({ products })
}

async function createProduct(req, res) {
  const { name, description, price, image } = req.body || {}
  if (!name || !description || typeof price !== 'number') {
    return res.status(400).json({ message: 'name, description, price are required' })
  }

  let finalImage = image

  const cloudOn =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET

  if (cloudOn && typeof image === 'string' && image.startsWith('data:image/')) {
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: 'ecoloop/products',
      resource_type: 'image',
    })
    finalImage = uploaded.secure_url
  }

  const product = await Product.create({
    name: String(name).trim(),
    description: String(description).trim(),
    price: Number(price),
    image: finalImage || undefined,
    sellerId: req.user._id,
  })

  await User.findByIdAndUpdate(req.user._id, { $push: { items: product._id } })

  return res.status(201).json({ product })
}

module.exports = { listProducts, createProduct }

