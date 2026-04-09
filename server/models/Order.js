const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    addressLine: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    address: { type: AddressSchema, required: true },
    paymentMethod: { type: String, enum: ['COD', 'UPI'], required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Out for Delivery', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Order', OrderSchema)

