import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.CloudapiKey,
  api_secret: process.env.CloudapiSecret,
});

export default async function uploadImagetoCloud(image) {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "uploads",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload image: " + error.message);
  }
}
