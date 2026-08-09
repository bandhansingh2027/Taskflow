const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';
  
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500 // Quick timeout if local mongodb service isn't running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Local MongoDB Unavailable (${error.message}). Initializing In-Memory Fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB fallback:', memErr.message);
      console.error('Please ensure MongoDB is running or configure MONGO_URI in .env');
      throw memErr;
    }
  }
};

module.exports = connectDB;
