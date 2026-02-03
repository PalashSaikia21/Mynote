import { Resend } from "resend";
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "./emailTemplate.mjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, token) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "MyNote <onboarding@resend.dev>", // temporary sender
      to,
      subject: "Verify Your Email",
      html: Verification_Email_Template.replace("{verificationCode}", token),
    });

    if (error) {
      console.error("Resend Error:", error);
      return;
    }

    console.log("Email sent:", data);
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
};

export const sendWelcomeEmail = async (to, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "MyNote <onboarding@resend.dev>",
      to,
      subject: "Welcome to MyNote",
      html: Welcome_Email_Template.replace("{name}", name),
    });

    if (error) {
      console.error("Resend Error:", error);
      return;
    }

    console.log("Email sent:", data);
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
};
