const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/booking.js");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");

// Create Route
router.post(
  "/",
  isLoggedIn,
  wrapAsync(bookingController.createBooking)
);

// Delete Route
// router.delete(
//   "/:reviewID",
//   isLoggedIn,
//   isReviewAuthor,
//   wrapAsync(reviewController.destroyReview)
// );

module.exports = router;
