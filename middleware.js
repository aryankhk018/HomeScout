const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//Authentication middleware
module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must Login first");
    return res.redirect("/login");
  }
  next();
};

//Redirect to originalUrl middleware
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//Authorization middleware for Owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Admin permissions needed");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Authorization middleware for Author
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Only admin can delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//ValidateListing middleware
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log("Validation error:", errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//ValidateReview middleware
module.exports.validateReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log("Validation error:", errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
