const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/extras.js");

router.get("/privacy", pagesController.renderPrivacy);
router.get("/terms", pagesController.renderTerms);

module.exports = router;
