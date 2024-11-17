import express from "express";
import { checkIfAuth, checkIfLoggedIn } from "../controllers/testsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("should-be-logged-in", verifyToken, checkIfLoggedIn);
router.get("should-be-auth", checkIfAuth);

export default router;
