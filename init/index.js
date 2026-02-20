const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
require("dotenv").config();

const Mongo_Url = "mongodb://localhost:27017/travelnest";

main()
  .then(() => {
    console.log("✅ Connected to DB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

async function main() {
  await mongoose.connect(Mongo_Url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  for (let obj of initData.data) {
    // Default geometry - can be enhanced later with actual geocoding
    obj.geometry = {
      type: "Point",
      coordinates: [0, 0], // Placeholder coordinates
    };
    obj.owner = process.env.ADMIN || "693e58ea5a57821ac739b4c4";
  }
  await Listing.insertMany(initData.data);
  console.log("✅ Data was initialized");
  mongoose.connection.close();
};

initDB();

// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listings.js");
// require('dotenv').config();
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapToken = process.env.MAPBOX_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const Mongo_Url = "mongodb://localhost:27017/travelnest";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(Mongo_Url);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   for (let obj of initData.data) {
//     let response = await geocodingClient
//       .forwardGeocode({
//         query: obj.location,
//         limit: 1,
//       })
//       .send();
//     const geometry = response.body.features[0].geometry || {
//       type: "Point",
//       coordinates: [0, 0],
//     };

//     obj.owner = "67cef00492794922b75b05f2";
//     obj.geometry = geometry;
//   }
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
