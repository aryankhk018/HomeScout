const User = require("../models/user.js");

// //To render signUp form
// module.exports.renderSignUpFrom = (req, res) => {
//     res.render("./users/signup.ejs");
//   }

//To sign Up user
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome! To HomeScout");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signUp");
  }
};

//To LogIn
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Home Scout!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//To logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Logged out, see you soon!");
    res.redirect("/listings");
  });
};
