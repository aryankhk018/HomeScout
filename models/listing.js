const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const defaultLink =
  "https://plus.unsplash.com/premium_photo-1661962404003-e0ca40da40ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const defaultFile = "listingimage";

//Creating a listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  category: {
    type: String,
    enum: [
      "Cities",
      "Mountains",
      "Swimming",
      "Greenland",
      "Beach",
      "Country",
      "Rooms",
      "Artic",
      "Castles",
      "Diving",
      "Farms",
    ],
  },
});

//middle ware to delete the reviews specified with the listing

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//Creating Listing model
const Listing = mongoose.model("Listing", listingSchema);

//Exporting the Listing model
module.exports = Listing;
