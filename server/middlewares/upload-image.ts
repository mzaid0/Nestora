import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.resolve(
        __dirname,
        "..",
        "..",
        "server",
        "uploads"
      );
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const random = uuid();
      cb(null, random + "-" + file.originalname);
    },
  }),
});
