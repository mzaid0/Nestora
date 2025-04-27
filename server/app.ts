import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//Routes
import authRouter from "./routes/auth-route.js";

app.use("/api/v1", authRouter);

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
