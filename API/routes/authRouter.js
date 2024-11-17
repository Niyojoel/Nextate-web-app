import express from "express";
import {changePassword, login, logout, signup} from "../controllers/authController.js"
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/change-password", verifyToken, changePassword);

export default router;
