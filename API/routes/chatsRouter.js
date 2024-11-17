import express from "express";
import { addChat, getChat, getChats, readChat } from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.route("/").get(getChats).post(addChat);
router.get("/:id", getChat);
router.patch("/read/:id", readChat);

export default router;
