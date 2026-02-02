const requestOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP before saving
  const salt = await bcrypt.genSalt(10);
  user.otp = await bcrypt.hash(otp, salt);

  // Set expiration for 10 minutes
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // SEND EMAIL HERE (e.g., via Nodemailer)
  // await sendEmail(user.email, "Your Recovery Code", `Your code is: ${otp}`);

  res.status(200).json({ message: "OTP sent to your email" });
};

const verifyOTPAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email }).select("+otp +otpExpires");

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
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};
