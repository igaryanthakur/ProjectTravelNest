const User = require("../models/user.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");
const listingController = require("./listings.js"); // Add this line

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to TravelNest!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out");
    res.redirect("/listings");
  });
};

module.exports.renderPrivacy = (req, res) => {
  res.render("extras/privacy.ejs");
};

module.exports.renderTerms = (req, res) => {
  res.render("extras/terms.ejs");
};

module.exports.renderProfile = async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      req.flash("error", "You must be logged in to view profile");
      return res.redirect("/login");
    }

    const user = await User.findById(req.user._id).populate({
      path: "bookings",
      populate: {
        path: "listing",
      },
    });

    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect("/listings");
    }

    const ownedListings = await Listing.find({ owner: req.user._id });
    res.render("users/profile", { currUser: user, ownedListings });
  } catch (err) {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

module.exports.renderEditForm = async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  if (req.params.id !== req.user._id.toString()) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect("/profile");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/profile");
  }
  res.render("users/edit.ejs", { user });
};

module.exports.updateProfile = async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  if (req.params.id !== req.user._id.toString()) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect("/profile");
  }

  try {
    const { username, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, email });
    req.flash("success", "Profile Updated!");
    res.redirect("/profile");
  } catch (err) {
    req.flash("error", "Error updating profile");
    res.redirect("/profile");
  }
};

module.exports.deleteProfile = async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  if (req.params.id !== req.user._id.toString()) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect("/profile");
  }

  try {
    const userId = req.params.id;

    // Delete all reviews by the user
    await Review.deleteMany({ author: userId });

    // Delete all bookings by the user
    await Booking.deleteMany({ user: userId });

    // Find all listings owned by the user
    const userListings = await Listing.find({ owner: userId });
    
    // Use destroyListing method for each listing with proper mock objects
    for (let listing of userListings) {
      const mockReq = {
        params: { id: listing._id.toString() },
        flash: req.flash.bind(req) // Pass the actual flash function
      };
      const mockRes = {
        redirect: () => {}, // Empty function since we don't need redirects
        locals: res.locals // Pass locals if needed
      };
      await listingController.destroyListing(mockReq, mockRes);
    }

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Your account and all associated data has been deleted successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error deleting account");
    res.redirect("/profile");
  }
};
