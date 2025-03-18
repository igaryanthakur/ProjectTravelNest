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

module.exports.destroyBooking = async (req, res) => {
  let { bookingID } = req.params;

  await User.findByIdAndUpdate(req.user._id, { $pull: { bookings: bookingID } });
  await Booking.findByIdAndDelete(bookingID);
  req.flash("success", "Successfully cancelled the booking!");
  res.redirect(`/profile`);
};
