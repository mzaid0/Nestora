import { Request, Response } from "express";
import { User } from "../models/user-model";
import { IUser } from "../types/user-type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupUser = async (
  req: Request<{}, {}, IUser>,
  res: Response<{ message: string }>
) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (exists) {
      res.status(409).json({ message: "User already exists" });
      return;
    }
    const saltRounds = Number(process.env.HASHED_PASSWORD_SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "Signup successful" });
  } catch (err: any) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      res.status(409).json({ message: "Duplicate key error" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signinUser = async (
  req: Request<{}, {}, IUser>,
  res: Response<{
    message: string;
    user?: {
      username: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .json({ message: "Signin successful", user: safeUser });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
