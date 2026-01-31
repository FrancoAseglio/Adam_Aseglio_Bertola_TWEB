const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/anime_db';

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000, });
    console.log('✅ Connected to MongoDB successfully at', mongoURI);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to', mongoURI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = { connectDB };
