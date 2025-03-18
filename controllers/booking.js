const User = require("../models/user.js");
const Booking = require("../models/booking.js");

module.exports.createBooking = async (req, res) => {
  let user = await User.findById(req.user._id);
  let newBooking = new Booking(req.body.booking);
  newBooking.listing = req.params.id;
  user.bookings.push(newBooking);

  await newBooking.save();
  await user.save();
  req.flash("success", "Successfully booked this property!");
  res.redirect(`/listings/${req.params.id}`);
};

// module.exports.destroyReview = async (req, res) => {
//   let { id, reviewID } = req.params;

//   await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
//   await Review.findByIdAndDelete(reviewID);
//   req.flash("success", "Successfully deleted the review!");
//   res.redirect(`/listings/${id}`);
// };
