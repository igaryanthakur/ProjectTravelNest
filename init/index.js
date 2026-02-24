const mongoose = require("mongoose");
const path = require("path");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const User = require("../models/user.js");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { geocodingClient } = require("../cloudConfig");

const Mongo_Url = process.env.ATLASDB_URL;

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

  // Create or fetch admin user
  let adminUser = await User.findOne({ email: "admin@travelnest.com" });

  if (!adminUser) {
    adminUser = new User({
      email: "admin@travelnest.com",
      username: "admin",
    });
    const registeredUser = await User.register(adminUser, "admin");
    console.log("✅ Admin user created");
  } else {
    console.log("✅ Using existing admin user");
  }

  for (let obj of initData.data) {
    try {
      let response = await geocodingClient
        .forwardGeocode({
          query: obj.location,
          limit: 1,
        })
        .send();

      const coordinates = response.body.features[0]?.geometry?.coordinates || [
        0, 0,
      ];
      obj.geometry = {
        type: "Point",
        coordinates: coordinates,
      };

      obj.owner = adminUser._id;
    } catch (err) {
      console.error(
        `❌ Error geocoding location ${obj.location}:`,
        err.message,
      );
      obj.geometry = {
        type: "Point",
        coordinates: [0, 0],
      };
      obj.owner = adminUser._id;
    }
  }
  await Listing.insertMany(initData.data);
  console.log("✅ Data was initialized");
  mongoose.connection.close();
};

initDB();
