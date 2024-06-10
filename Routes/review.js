const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const {
  validateReviews,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reveiwController = require("../controllers/reviews.js");

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateReviews,
  wrapAync(reveiwController.createReview)
);

//Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAync(reveiwController.deleteReview)
);

module.exports = router;
