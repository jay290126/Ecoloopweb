const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

async function connectDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI in environment')

  mongoose.set('strictQuery', true)
  try {
    await mongoose.connect(uri)
    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected')
    return
  } catch (err) {
    const allowFallback =
      process.env.MONGODB_MEMORY === 'true' || process.env.NODE_ENV !== 'production'
    if (!allowFallback) throw err

    // eslint-disable-next-line no-console
    console.warn('⚠️ MongoDB unavailable, starting in-memory MongoDB for development...')
    const mem = await MongoMemoryServer.create()
    await mongoose.connect(mem.getUri())
    // eslint-disable-next-line no-console
    console.log('✅ In-memory MongoDB connected')
  }
}

module.exports = { connectDb }

