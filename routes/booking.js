const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/booking.js");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");

// Create Route
router.post(
  "/",
  validateBooking,
  isLoggedIn,
  wrapAsync(bookingController.createBooking)
);

// Delete Route
router.delete(
  "/:bookingID",
  isLoggedIn,
  wrapAsync(bookingController.destroyBooking)
);

module.exports = router;
