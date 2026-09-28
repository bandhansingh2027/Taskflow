const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGODB_URL ||
    ''
  ).trim();

  if (!uri || uri.includes('127.0.0.1:27017')) {
    console.error('------------------------------------------------------------------');
    console.error('❌ MONGODB_URI IS MISSING OR NOT CONFIGURED FOR MONGODB ATLAS!');
    console.error('Please open Taskflow/backend/.env and paste your connection string:');
    console.error('MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority');
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
    console.error('Please check your MONGODB_URI username/password and Network Access IP Whitelist in MongoDB Atlas.');
    console.error('------------------------------------------------------------------');
    return null;
  }
};

module.exports = connectDB;
