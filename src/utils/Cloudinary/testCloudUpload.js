// testCloudUpload.js
//use this in terminal for testing node src/utils/Cloudinary/testCloudUpload.js

import uploadImagetoCloud from "./uploadImagetoCloud.js";

const imagePath = "public/noavatar.png";

(async () => {
  try {
    const imageUrl = await uploadImagetoCloud(imagePath);
    console.log("Image uploaded successfully. Secure URL:", imageUrl);
  } catch (error) {
    console.error("Failed to upload image:", error);
  }
})();
