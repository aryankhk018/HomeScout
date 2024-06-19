if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//Requiring all the npm packages
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const ejsMate = require("@simonsmith/ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Requiring different models which are created with router
const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");
const Listing = require("./models/listing.js");

//Connectiong to database via mongoose
// const MONGO_URL = "mongodb://127.0.0.1:27017/homescout";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then((res) => {
    console.log("Successfully connected to homescout");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//setting path of views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Using the url parameters
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

//variable for session options

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// //Root Route
// app.get("/", (req, res) => {
//   res.send("Hi, i am root");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//Listings Route
app.use("/listings", listingRouter);

//Review Route
app.use("/listings/:id/review", reviewRouter);
//Login and signUP router
app.use("/", userRouter);

//Error handler middleware for all routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!!"));
});

//Error handler middleware for all routes to display error.ejs file
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.render("./Error/error.ejs", { err });
});

//Setting the port for the server
app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
