const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';
  
  try {
    const isAtlas = primaryUri.includes('mongodb+srv://');
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 2500
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (process.env.MONGODB_URI || process.env.MONGO_URI) {
      console.warn(`MongoDB Primary Connection Failed (${error.message}).`);
    } else {
      console.warn(`Local MongoDB Unavailable (${error.message}). Initializing In-Memory Fallback...`);
    }

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB fallback:', memErr.message);
      console.error('Please configure MONGODB_URI in backend/.env');
      throw memErr;
    }
  }
};

module.exports = connectDB;
