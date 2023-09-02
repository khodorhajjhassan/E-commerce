import express from "express";
import passport from "passport";
import {
  AddUser,
  GoogleLogin,
  confirmVerify,
  deleteLogs,
  forgotpassword,
  getLogs,
  login,
  refreshToken,
  register,
} from "../controllers/auth.js";
import { logout } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "success",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failer",
  });
});

router.post("/register", register);
router.post("/add", AddUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refreshToken", refreshToken);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  GoogleLogin
);
router.post("/forgotpassword", forgotpassword);
router.get("/resetPassword/:t", confirmVerify);
router.get("/logs", getLogs);
router.delete("/:id", deleteLogs);
export default router;
