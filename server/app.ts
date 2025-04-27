import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
