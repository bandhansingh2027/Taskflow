const mongoose = require('mongoose');

const connectDB = async () => {
  const isDemoMode = process.env.DEMO_MODE === 'true';

  if (isDemoMode) {
    console.log('========================================');
    console.log('TaskFlow Backend');
    console.log(`Server: http://localhost:${process.env.PORT || 5000}`);
    console.log('Mode: DEMO');
    console.log('Database: Local Demo Store');
    console.log('Status: READY');
    console.log('========================================');
    return null;
  }

  const uri = (process.env.MONGODB_URI || '').trim();

  if (!uri) {
    console.error('------------------------------------------------------------------');
    console.error('❌ MONGODB_URI IS MISSING OR EMPTY!');
    console.error('Please configure MONGODB_URI in Taskflow/backend/.env or set DEMO_MODE=true');
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
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MONGODB_URI credentials or set DEMO_MODE=true in backend/.env');
    console.error('------------------------------------------------------------------');
    return null;
  }
};

module.exports = connectDB;
