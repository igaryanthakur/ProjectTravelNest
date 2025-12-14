const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "travelnest",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
  geocodingClient,
};
