import express from "express";
import mongoose from "mongoose";
import User from "../models/userModel.mjs";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../Verification/emailVarification.mjs";
import { logUserActivity } from "./userControllers.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { jswSecret } from "../../config.mjs";
import Notification from "../models/notificationModel.mjs";

const postRegister = async (req, res) => {
  console.log("Register request body:", req.body);
  let userId = null;
  const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const adminForbiddenRegex = /^admin/i;

  const { name, email, password, passwordConfirm, username } = req.body;
  if (!name || !email || !password || !passwordConfirm || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username must be at least 3 characters and contain only letters and numbers.",
    });
  }
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  if (adminForbiddenRegex.test(username)) {
    return res.status(400).json({
      message: "Username cannot contain 'admin' or restricted keywords.",
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: errors[0] });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      username,
    });
    console.log("New user created:", newUser);
    const content = `Welcome ${name}, You're in. We kept it simple: Write notes, find people, and stay organized. No bloat, no nonsense. Change your profile settings and setup security question and answer. Need help? contact us anytime. Happy noting!`;

    // await Notification.create({
    //   recipientId: newUser._id,
    //   targetModel: "User",
    //   content: content,
    //   targetId: newUser._id,
    //   isRead: false,
    //   isSeen: false,
    //   // If you kept the fields required, you'd have to pass
    //   // the newUser._id as the actor and target just to satisfy Mongoose.
    // });
    await sendWelcomeEmail(email, name);
    userId = newUser._id;
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
  return res
    .status(201)
    .json({ message: "User registered successfully", userId });
};

const changePassword = async (req, res) => {
  console.log("Change password request body:", req.body);
  try {
    const { newPassword, newPasswordConfirm, email, occassion } = req.body;
    let currentPassword = req.body.currentPassword || " "; // Default to a non-empty string to bypass validation when not required
    if (occassion !== "forgetPassword") {
      if (!currentPassword || !newPassword || !newPasswordConfirm) {
        return res.status(400).json({ message: "All fields are required" });
      }
    } else {
      if (!newPassword || !newPasswordConfirm) {
        return res.status(400).json({ message: "All fields are required" });
      }
    }
    console.log("Current Password:", currentPassword);
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New passwords must be different from the old one" });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const { isValid, errors } = validatePassword(newPassword);
    if (!isValid) {
      return res.status(400).json({ message: errors[0] });
    }

    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    }).select("+passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentPassword !== " ") {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    const payload = {
      userType: user.userType,
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
    };
    const newToken = jwt.sign(payload, jswSecret, { expiresIn: "24h" });

    const userWithToken = user.toObject();
    delete userWithToken.passwordHash; // Security cleanup
    userWithToken.token = newToken;

    logUserActivity(user._id, user.name, user.userType, "change_password");

    // Return the new token so the frontend can update localStorage
    return res.status(200).json({
      message: "Password changed successfully",
      user: userWithToken,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const postLogin = async (req, res) => {
  console.log("Login request body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    let userToLogin = await User.findOne({
      $or: [{ email: email }, { username: email }],
    }).select("+passwordHash");

    if (userToLogin !== null) {
      const isMatch = await bcrypt.compare(
        req.body.password,
        userToLogin?.passwordHash
      );
      if (isMatch) {
        const payload = {
          userType: userToLogin.userType,
          id: userToLogin._id,
          email: userToLogin.email,
          username: userToLogin.username,
          name: userToLogin.name,
        };

        const token = jwt.sign(payload, jswSecret, { expiresIn: "24h" });

        const userLogedIn = userToLogin.toObject();
        userLogedIn.token = token;

        logUserActivity(
          userToLogin._id,
          userToLogin.name,
          userToLogin.userType,
          "login"
        );

        return res
          .status(200)
          .json({ message: "Login successful", user: userLogedIn });
      } else {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
    }
    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const authentication = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  //const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, jswSecret);
    req.user = decoded;
    console.log("Token:", decoded);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorization = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  console.log("user from authorization middleware:", user.email);
  next();
};

const recoveryPassword = async (req, res) => {
  const { email, question, answer } = req.body;
  console.log("Recovery request body:", req.body);

  if (!email || !question || !answer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Guess: Using $or is good for flexibility (email vs username)
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  }).select("+securityQuestion +securityAnswer");

  if (!user) {
    // Opinion: Returning 404 is fine for internal apps, but for public ones,
    // "Mismatch" is safer to prevent email harvesting.
    return res.status(404).json({ message: "User not found" });
  }
  const processedAnswer = answer.toLowerCase().trim();
  const isAnswerMatch = await bcrypt.compareSync(
    answer.toLowerCase().trim(),
    user.securityAnswer
  );

  if (user.securityQuestion !== question || !isAnswerMatch) {
    return res.status(401).json({
      message: "The archives do not match your provided credentials.",
    });
  }

  // Fact: Since you aren't providing a token, the user is still 'locked out'
  // until they check their email.
  return res.status(200).json({
    message:
      "Identity verified. A recovery scroll has been sent to your email.",
  });
};

const changeSecurity = async (req, res) => {
  console.log("Change security request body:", req.body);
  try {
    const { email, question, answer } = req.body;
    const salt = await bcrypt.genSalt(10);
    const answerHash = await bcrypt.hash(answer.toLowerCase().trim(), salt);
    const updatedUser = await User.findOneAndUpdate(
      { username: email },
      { securityQuestion: question, securityAnswer: answerHash },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    updatedUser.securityQuestion = question; // For frontend display, since we hash the answer but not the question
    res.status(200).json({
      message: "Security question updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error changing security question:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const requestOTP = async (req, res) => {
  console.log("Request OTP body:", req.body);
  const { email } = req.body;
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP before saving
  const salt = await bcrypt.genSalt(10);
  user.otp = await bcrypt.hash(otp, salt);

  // Set expiration for 10 minutes
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  sendVerificationEmail(user.email, otp);
  // SEND EMAIL HERE (e.g., via Nodemailer)
  // await sendEmail(user.email, "Your Recovery Code", `Your code is: ${otp}`);

  res.status(200).json({ message: "OTP sent to your email" });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("inside otp verification, request body:", req.body);
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  }).select("+otp +otpExpires");

  if (!user || !user.otp)
    return res.status(400).json({ message: "Invalid request" });

  // Check Expiry
  if (Date.now() > user.otpExpires) {
    return res.status(401).json({ message: "OTP has expired" });
  }

  // Compare OTP
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) return res.status(401).json({ message: "Invalid OTP" });

  // Clear OTP fields and update password
  user.isUserVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

const changeEmail = async (req, res) => {
  const { username, email } = req.body;

  // 1. Validate format (Rule: Don't trust the client)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(401).json({ message: "Invalid email format." });
  }

  try {
    // 2. Check if the email is already taken by ANOTHER user
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log("Email already in use:", email);
      return res
        .status(400)
        .json({ message: "Email is already in use by another account." });
    }

    // 3. Update the user
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { email: email, isUserVerified: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user: updatedUser,
      message: "Email changed successfully. Please verify your new email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Validates password strength
 * Requirements: 8+ chars, 1 upper, 1 lower, 1 number, 1 special char
 */
function validatePassword(password) {
  const requirements = [
    { regex: /.{8,}/, message: "At least 8 characters long" },
    { regex: /[A-Z]/, message: "At least one uppercase letter" },
    { regex: /[a-z]/, message: "At least one lowercase letter" },
    { regex: /[0-9]/, message: "At least one number" },
    { regex: /[^A-Za-z0-9]/, message: "At least one special character" },
  ];

  const errors = requirements
    .filter((req) => !req.regex.test(password))
    .map((req) => req.message);

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

export {
  postRegister,
  postLogin,
  authentication,
  authorization,
  changePassword,
  recoveryPassword,
  changeSecurity,
  verifyOTP,
  requestOTP,
  changeEmail,
};
