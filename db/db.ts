import "dotenv/config";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";

const connectToDatabase = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URL, () => {
    console.log("Connected to database");
  });
};

export { connectToDatabase };
