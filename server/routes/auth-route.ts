import { Router } from "express";
import { signinUser, signupUser } from "../controllers/auth-controller.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);

export default router;
