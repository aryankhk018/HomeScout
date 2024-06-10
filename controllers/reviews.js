const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = await Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview.author);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review uploaded");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
