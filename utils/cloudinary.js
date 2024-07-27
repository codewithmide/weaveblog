import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dktuufqyv',
  api_key: '416317751352711',
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export default cloudinary;
