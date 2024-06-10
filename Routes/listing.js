const express = require("express");
const router = express.Router();
const wrapAync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/search", wrapAync(listingController.searchListing));

router
  .route("/")
  .get(wrapAync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAync(listingController.createListing)
  );

//New create Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAync(listingController.showListing))
  .put(
    isOwner,
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAync(listingController.deleteListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAync(listingController.renderEditForm)
);

router.get(
  "/category/:category",
  wrapAync(listingController.listingWithCategory)
);

module.exports = router;
