import "dotenv/config";
import express from "express";
import authRouter from "./src/routers/AuthRoute.mjs";
import userRouter from "./src/routers/UserRouter.mjs";
import noteRouter from "./src/routers/NoteRouter.mjs";
import cors from "cors";
import mongoose from "mongoose";
import { mongodbURI, port } from "./config.mjs";
const app = express();

mongoose
  .connect(mongodbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
app.use(express.json());
app.use(cors());
app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/notes", noteRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
