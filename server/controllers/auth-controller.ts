import { Request, Response } from "express";
import { User } from "../models/user-model";
import { IUser } from "../types/user-type";
import bcrypt from "bcryptjs";

export const signupUser = async (
  req: Request<{}, {}, IUser>,
  res: Response<{ message: string }>
): Promise<void> => {
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.HASHED_PASSWORD_SALT)
  );

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Signup successful",
    });
  } catch (error: unknown) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
