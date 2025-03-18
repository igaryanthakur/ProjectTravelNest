const Listing = require("./models/listings.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema, bookingSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateBooking = (req, res, next) => {
  let { error } = bookingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } else {
    res.locals.redirectUrl = "/listings";
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (
    listing.owner.equals(res.locals.currUser._id) ||
    res.locals.currUser.equals(process.env.ADMIN)
  ) {
    next();
  } else {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/listings/${id}`);
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewID } = req.params;
  let review = await Review.findById(reviewID);
  if (
    review.author.equals(res.locals.currUser._id) ||
    res.locals.currUser.equals(process.env.ADMIN)
  ) {
    next();
  } else {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/listings/${id}`);
  }
};
