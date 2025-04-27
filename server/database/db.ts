import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URL!);
    console.log(`MongoDB Connected: ${connect.connection.name}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};