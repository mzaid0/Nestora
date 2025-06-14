import { Document, model, Schema } from "mongoose";
import { IUser } from "../types/user-type";

interface IUserDoc extends IUser, Document {}

const userSchema = new Schema<IUserDoc>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
  },
  { timestamps: true }
);

export const User = model<IUserDoc>("User", userSchema);
