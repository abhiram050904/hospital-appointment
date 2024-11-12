import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  });
  console.log('Cloudinary configured');
};

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
  connectDb();
  connectCloudinary();
});