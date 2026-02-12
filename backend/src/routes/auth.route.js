import express from "express";
import { register, login, getProfile, updateProfile, checkUsername, googleLogin } from "../controller/auth.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/check-username/:username", checkUsername);
router.post("/google-login", googleLogin);

export default router;
