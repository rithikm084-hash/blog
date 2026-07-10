const app = require('./app');
const { connectDatabase } = require('./db');

const PORT = process.env.PORT || 5000;

connectDatabase({ allowMemoryFallback: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
