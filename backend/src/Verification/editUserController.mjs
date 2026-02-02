import User from "../models/model-user";
import emailVarificationfrom from "./emailVarification.mjs";

exports.getHostPhoto = (req, res, next) => {};

exports.getEditEmail = (req, res, next) => {
  console.log("Session values", req.session);
  const user = req.session.user;
  res.render("common/profile", {
    title: "Profile Page",
    message: "Welcome to the Your profile Page!",
    currentPage: "profile",
    isLoggedIn: req.session.isLoggedIn,
    user: user, // Pass the user information to the view
    loginUsername: req.session.user.username,
    toEditField: "email",
  });
};

exports.postEditEmail = async (req, res, next) => {
  const username = req.session.user.username; // Assuming user ID is stored in session
  const user = await User.findOne({ username: username });
  user.email = req.body.newEmail; // Update the email field
  const varificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  emailVarification
    .sendVerificationEmail(user.email, varificationToken)
    .catch(console.error);
  req.body.otpForEmail = varificationToken;
  user.isEmailVerified = false; // Reset email verification status
  user.otpForEmail = varificationToken;
  user.otpForEmailExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  user.userType = "guest"; // Downgrade user type to guest until email is verified
  await user.save(); // Save the updated user document
  req.session.user = user; // Update session user data
  await req.session.save();
  res.render("common/profile", {
    title: "Profile Page",
    message: "Welcome to the Your profile Page!",
    currentPage: "profile",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user, // Pass the user information to the view
    loginUsername: req.session.user.username,
    toEditField: "",
  });
};
