const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // tu Cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // tu API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // tu API Secret
});

module.exports = cloudinary;