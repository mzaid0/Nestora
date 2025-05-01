import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";
import { DecodedData } from "../types/user-type";

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "Authentication token is required, Please login first",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedData;

    if (!decoded.id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    req.user = user;

    next();
  } catch (err: any) {
    console.error("Auth error:", err);
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
