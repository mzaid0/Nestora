import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export interface IUser {
  name: any;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}

export type DecodedData = JwtPayload & { id: string };

declare global {
  namespace Express {
    interface Request {
      user?: IUser & Document;
    }
  }
}
