const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  listing: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});
module.exports = mongoose.model("Review", bookingSchema);
