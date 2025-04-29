import { Router } from "express";
import {
  googleController,
  signinUser,
  signupUser,
} from "../controllers/auth-controller.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
router.route("/google").post(googleController);

export default router;
