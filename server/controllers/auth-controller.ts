import { Request, Response } from "express";
import { User } from "../models/user-model";
import { IUser } from "../types/user-type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      avatar?: string;
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
      avatar: user.avatar,
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

export const googleController = async (
  req: Request<{}, {}, IUser>,
  res: Response<{
    message: string;
    user?: {
      name?: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      avatar?: string;
    };
  }>
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1h",
      });
      const safeUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
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
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const saltRounds = Number(process.env.HASHED_PASSWORD_SALT);

      const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        avatar: req.body.avatar,
        password: hashedPassword,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1h",
      });
      const safeUser = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
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
    }
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    if (!userId) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    if (req.body.password) {
      const saltRounds = Number(process.env.HASHED_PASSWORD_SALT);
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    let avatarUrl = user.avatar;

    if (req.file) {
      const localPath = req.file.path;

      try {
        if (user.avatar) {
          const publicId = user.avatar.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId!);
        }
        const cloudinaryPath = await cloudinary.uploader.upload(localPath);
        avatarUrl = cloudinaryPath.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log("Cloudinary Error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username ?? user.username,
          password: req.body.password ?? user.password,
          avatar: avatarUrl,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.error("Updating error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
