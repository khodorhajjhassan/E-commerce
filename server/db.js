
/*
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
// MongoDB connection URL
const mongoURI = process.env.Mongoconnect;

// Function to connect to MongoDB
const connectDb= async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// Function to disconnect from MongoDB
const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};



export { connectDb, disconnectDb };

*/