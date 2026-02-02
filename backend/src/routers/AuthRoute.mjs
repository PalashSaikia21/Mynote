import express from "express";
import {
  postRegister,
  postLogin,
  changePassword,
  authentication,
  recoveryPassword,
  changeSecurity,
  requestOTP,
  verifyOTP,
  changeEmail,
} from "../controllers/authControllers.mjs";

const authRouter = express.Router();

authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);
authRouter.post("/changePassword", changePassword);
authRouter.post("/recoveryPassword", recoveryPassword);
authRouter.post("/changeSecurity", changeSecurity);
authRouter.post("/requestOTP", authentication, requestOTP);
authRouter.post("/verifyOTP", authentication, verifyOTP);
authRouter.post("/changeEmail", authentication, changeEmail);
authRouter.post("/requestOTPForPassword", requestOTP);
authRouter.post("/verifyOTPForPassword", verifyOTP);

export default authRouter;
