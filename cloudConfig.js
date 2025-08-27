import { v2 as cloudinary } from 'cloudinary';
import {CloudinaryStorage} from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUND_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'escapenest_DEV',
    allowedFormats: ["png","jpg","jpeg"]
  }
});

export {cloudinary,storage};