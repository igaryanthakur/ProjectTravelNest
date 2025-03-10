const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const Mongo_Url = "mongodb://localhost:27017/travelnest";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_Url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67cef00492794922b75b05f2",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
