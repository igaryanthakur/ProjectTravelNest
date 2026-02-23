const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

cloudinary.v2.config({
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
    resource_type: "auto",
  },
});

module.exports = {
  cloudinary: cloudinary.v2,
  storage,
  geocodingClient,
};
