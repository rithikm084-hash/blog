require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
const DEBUG_LOG = path.join(__dirname, '..', 'debug-ba8274.log');

function debugLog(location, message, data, hypothesisId) {
  const entry = JSON.stringify({
    sessionId: 'ba8274',
    runId: process.env.DEBUG_RUN_ID || 'startup',
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  // #region agent log
  try {
    fs.appendFileSync(DEBUG_LOG, entry + '\n');
  } catch (_) {}
  fetch('http://127.0.0.1:7887/ingest/f1d71bf0-4fe7-493e-b8e8-663a894d804c', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ba8274' },
    body: entry,
  }).catch(() => {});
  // #endregion
}

function isLocalMongoUri(uri) {
  return /127\.0\.0\.1|localhost/.test(uri || '');
}

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (process.env.USE_MEMORY_DB === 'true') {
    const memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('MongoDB connected (in-memory dev database)');
    // #region agent log
    debugLog('server.js:mongo', 'MongoDB connected', { mode: 'memory', readyState: mongoose.connection.readyState }, 'B');
    // #endregion
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
    // #region agent log
    debugLog('server.js:mongo', 'MongoDB connected', { mode: 'uri', readyState: mongoose.connection.readyState }, 'B');
    // #endregion
  } catch (err) {
    if (isLocalMongoUri(uri)) {
      console.warn('Local MongoDB unavailable, starting in-memory database for development...');
      const memoryServer = await MongoMemoryServer.create();
      await mongoose.connect(memoryServer.getUri());
      console.log('MongoDB connected (in-memory dev database)');
      // #region agent log
      debugLog('server.js:mongo', 'MongoDB connected after fallback', { mode: 'memory-fallback', readyState: mongoose.connection.readyState }, 'B');
      // #endregion
      return;
    }
    throw err;
  }
}

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// #region agent log
debugLog('server.js:boot', 'Server bootstrap started', {
  hasMongoUri: Boolean(process.env.MONGODB_URI),
  hasJwtSecret: Boolean(process.env.JWT_SECRET),
  port: PORT,
  nodeVersion: process.version,
}, 'A');
// #endregion

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      // #region agent log
      debugLog('server.js:listen', 'HTTP server listening', { port: PORT }, 'E');
      // #endregion
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // #region agent log
    debugLog('server.js:mongo-error', 'MongoDB connection failed', { errorName: err.name, errorMessage: err.message }, 'B');
    // #endregion
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
