const Listing = require("../models/listings");
require("dotenv").config();
const { geocodingClient, cloudinary } = require("../cloudConfig");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings, searchCountry: null });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, admin: process.env.ADMIN });
};

module.exports.searchListings = async (req, res) => {
  const { country, category } = req.query;
  let filter = {};

  if (country && country.trim() !== "") filter.country = country;
  if (category) filter.category = category;

  const searchedListings = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListings: searchedListings,
    searchCountry: country && country.trim() !== "" ? country : null,
    filterCategory: category,
  });
};

module.exports.filteredListings = async (req, res) => {
  const { category } = req.params;
  const { country } = req.query;
  const filteredListings = await Listing.find({ category });
  res.render("listings/index.ejs", {
    allListings: filteredListings,
    searchCountry: country && country.trim() !== "" ? country : null,
    filterCategory: category,
  });
};

module.exports.filterByPrice = async (req, res) => {
  const { price } = req.params;
  const { country, category } = req.query;
  let filter = { price: { $lte: parseInt(price) } };

  if (country && country.trim() !== "") filter.country = country;
  if (category) filter.category = category;

  const filteredListings = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListings: filteredListings,
    searchCountry: country && country.trim() !== "" ? country : null,
    filterCategory: category,
    filterPrice: price,
  });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "upload",
    "upload/ar_1.0,c_fill,h_200,w_200/bo_5px_solid_lightblue"
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  listing.geometry = response.body.features[0].geometry;

  if (typeof req.file != "undefined") {
    if (listing.image && listing.image.filename) {
      try {
        await cloudinary.uploader.destroy(listing.image.filename);
        console.log();
      } catch (err) {
        console.error(
          `❌ Failed to delete old image: ${listing.image.filename}`,
          err.message
        );
      }
    }
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  if (deletedListing) {
    try {
      await cloudinary.uploader.destroy(deletedListing.image.filename);
      console.log();
    } catch (err) {
      console.error("❌ Error deleting image from Cloudinary:", err.message);
    }
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
};
