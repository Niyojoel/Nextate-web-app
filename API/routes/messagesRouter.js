import express from "express"
import { addMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/:id", verifyToken, addMessage);

export default router;