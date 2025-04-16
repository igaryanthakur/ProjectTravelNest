const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

router.get("/profile", userController.renderProfile);
router.get(
  "/profile/:id/edit",
  isLoggedIn,
  wrapAsync(userController.renderEditForm)
);
router.put("/profile/:id", isLoggedIn, wrapAsync(userController.updateProfile));
router.delete(
  "/profile/:id",
  isLoggedIn,
  wrapAsync(userController.deleteProfile)
);

router.get("/privacy", userController.renderPrivacy);
router.get("/terms", userController.renderTerms);

module.exports = router;
