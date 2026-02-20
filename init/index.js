const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
require("dotenv").config();
const { geocodingClient } = require("../cloudConfig");

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
    try {
      let response = await geocodingClient
        .forwardGeocode({
          query: obj.location,
          limit: 1,
        })
        .send();
      const geometry = response.body.features[0]?.geometry || {
        type: "Point",
        coordinates: [0, 0],
      };

      obj.owner = process.env.ADMIN || "67cef00492794922b75b05f2";
      obj.geometry = geometry;
    } catch (err) {
      console.error(
        `❌ Error geocoding location ${obj.location}:`,
        err.message,
      );
      obj.geometry = {
        type: "Point",
        coordinates: [0, 0],
      };
    }
  }
  await Listing.insertMany(initData.data);
  console.log("✅ Data was initialized");
  mongoose.connection.close();
};

initDB();
