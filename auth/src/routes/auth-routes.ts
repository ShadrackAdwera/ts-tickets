import { body } from "express-validator";
import express from "express";

import AuthControllers from "../controllers/auth-controllers";
import checkAuth from "../middlewares/auth-middleware";

const { getCurrentUser, login, signUp, requestResetPassword, resetPassword } =
  AuthControllers;

const router = express.Router();

router.post(
  "/sign-up",
  [
    body("email").trim().normalizeEmail().isEmail(),
    body("password").trim().isLength({ min: 6 }),
  ],
  signUp
);

router.post(
  "/login",
  [
    body("email").trim().normalizeEmail().isEmail(),
    body("password").trim().isLength({ min: 6 }),
  ],
  login
);

router.post(
  "/request-reset-password",
  [body("email").trim().normalizeEmail().isEmail()],
  requestResetPassword
);

router.post(
  "/reset-password/:resetToken",
  [body("password").trim().isLength({ min: 6 })],
  resetPassword
);

router.use(checkAuth);
router.get("/current-user", getCurrentUser);

export default router;
