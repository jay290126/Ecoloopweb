export type Product = {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  sellerId: string
  createdAt?: string
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Out for Delivery' | 'Delivered'

export type Order = {
  _id: string
  orderId: string
  userId: string
  productId: Product
  address: {
    fullName: string
    addressLine: string
    city: string
    pincode: string
    phone: string
  }
  paymentMethod: 'COD' | 'UPI'
  status: OrderStatus
  createdAt: string
}

