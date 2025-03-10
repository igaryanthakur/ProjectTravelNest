const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const Mongo_Url = "mongodb://localhost:27017/wanderlust";

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
    owner: "67c7c08cf5e20bac1414f6a7",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
