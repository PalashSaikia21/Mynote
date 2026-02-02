import dotenv from "dotenv";

dotenv.config();

const mongodbURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";
const port = process.env.PORT || 3000;
const jswSecret = process.env.JWT_SECRET;

export { mongodbURI, port, jswSecret };
