import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('your_mongodb_atlas_connection_string')) {
    console.log('ℹ️  No valid MONGODB_URI in server/.env — Running in hybrid fallback mode.');
    console.log('👉 To connect to real MongoDB Atlas, add your MONGODB_URI to server/.env');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠️  MongoDB connection error: ${error.message}`);
    console.log('⚠️  Falling back to in-memory store so server stays running.');
    isConnected = false;
    return false;
  }
};

export const isDbConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};
