import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongodb conectado a:", mongoose.connection.db.databaseName);
});