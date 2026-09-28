const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = (process.env.MONGODB_URI || '').trim();

  if (!uri) {
    console.error('------------------------------------------------------------------');
    console.error('❌ MONGODB_URI IS MISSING OR EMPTY!');
    console.error('Please configure MONGODB_URI in Taskflow/backend/.env');
    console.error('------------------------------------------------------------------');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    const isAtlas = uri.includes('mongodb+srv://') || conn.connection.host.includes('mongodb.net');
    if (isAtlas) {
      console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    } else {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    console.error('------------------------------------------------------------------');
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.error('Please check your MONGODB_URI credentials and Network Access IP Whitelist in MongoDB Atlas.');
    console.error('------------------------------------------------------------------');
    return null;
  }
};

module.exports = connectDB;
