const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { cloudinary } = require("../cloudConfig");
const Listing = require("../models/listings");

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/travelnest");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
})();

// Temporary download directory
const downloadDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// Function to download image
async function downloadImage(url) {
  try {
    // Extract filename without query parameters
    const fileName = path.basename(url.split("?")[0]);
    const filePath = path.join(downloadDir, fileName);

    const response = await axios({ url, responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    return filePath;
  } catch (err) {
    console.error("❌ Error downloading image:", err.message);
    return null;
  }
}

// Upload function
async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "travelnest",
    });
    return result;
  } catch (err) {
    console.error("❌ Error uploading to Cloudinary:", err.message);
    return null;
  }
}

// Migrate images
async function migrateImages() {
  try {
    const listings = await Listing.find({ "image.url": { $exists: true } });

    for (const listing of listings) {
      const imageUrl = listing.image.url;

      // Download image
      const downloadedImage = await downloadImage(imageUrl);
      if (!downloadedImage) {
        console.warn(`⚠️ Skipping image: ${imageUrl}`);
        continue;
      }

      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(downloadedImage);
      if (!cloudinaryResult) {
        console.warn(`⚠️ Failed to upload image: ${imageUrl}`);
        continue;
      }

      // Update MongoDB with new Cloudinary URL and filename
      listing.image.url = cloudinaryResult.secure_url;
      listing.image.filename = cloudinaryResult.public_id;
      await listing.save();

      console.log(
        `✅ Updated MongoDB for ${imageUrl} -> ${cloudinaryResult.secure_url}`,
      );

      // Delete the temporary file
      fs.unlink(downloadedImage, (err) => {
        if (err)
          console.error(
            "❌ Error deleting file:",
            downloadedImage,
            err.message,
          );
        else console.log(`🗑️ Deleted temporary file: ${downloadedImage}`);
      });
    }
  } catch (err) {
    console.error("❌ Error during image migration:", err.message);
  } finally {
    console.log("✅ Image migration completed.");
    mongoose.connection.close();
  }
}

migrateImages();
