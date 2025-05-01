import { Router } from "express";
import {
  googleController,
  signinUser,
  signupUser,
  updateUser,
} from "../controllers/auth-controller.js";
import { isAuthenticatedUser } from "../middlewares/auth-middleware.js";
import { upload } from "../middlewares/upload-image.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
router.route("/google").post(googleController);
router.put(
  "/update/:id",
  isAuthenticatedUser,
  upload.single("avatar"),
  updateUser
);
export default router;