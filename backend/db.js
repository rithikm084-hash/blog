const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function isLocalMongoUri(uri) {
  return /127\.0\.0\.1|localhost/.test(uri || '');
}

async function connectWithMemoryServer() {
  const memoryServer = await MongoMemoryServer.create();
  return mongoose.connect(memoryServer.getUri());
}

async function connectDatabase({ allowMemoryFallback = false } = {}) {
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (process.env.USE_MEMORY_DB === 'true') {
    cached.promise = connectWithMemoryServer();
    cached.conn = await cached.promise;
    console.log('MongoDB connected (in-memory dev database)');
    return cached.conn;
  }

  if (!uri) {
    throw new Error('MONGODB_URI is required in production');
  }

  try {
    cached.promise = mongoose.connect(uri);
    cached.conn = await cached.promise;
    console.log('MongoDB connected');
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    if (allowMemoryFallback && isLocalMongoUri(uri)) {
      console.warn('Local MongoDB unavailable, starting in-memory database for development...');
      cached.promise = connectWithMemoryServer();
      cached.conn = await cached.promise;
      console.log('MongoDB connected (in-memory dev database)');
      return cached.conn;
    }
    throw err;
  }
}

module.exports = { connectDatabase };
