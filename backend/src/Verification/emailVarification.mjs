import nodemailer from "nodemailer";
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "./emailTemplate.mjs";

// Moving the transporter creation inside a function to ensure
// process.env is fully loaded before use.
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
};

export const sendVerificationEmail = async (to, token) => {
  const transporter = getTransporter(); // Read env variables NOW

  const info = await transporter.sendMail({
    from: `"MyNote Support" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    text: `Your OTP is ${token}`,
    html: Verification_Email_Template.replace("{verificationCode}", token),
  });
  console.log("Email Sent: %s", info.messageId);
};

export const sendWelcomeEmail = async (to, name) => {
  const transporter = getTransporter(); // Read env variables NOW

  const info = await transporter.sendMail({
    from: `"MyNote Support" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Welcome to MyNote",
    text: `Welcome ${name}!`,
    html: Welcome_Email_Template.replace("{name}", name),
  });
  console.log("Message sent: %s", info.messageId);
};
