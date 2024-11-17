import express from "express"
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  getProfilePosts,
  getNotification,
  getAgents,
 
} from "../controllers/usersController.js";
import {verifyToken} from '../middlewares/verifyToken.js'
import { uploadUserAvatar } from "../middlewares/uploads.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/agents", getAgents);

router.use(verifyToken);
router.post("/save", savePost);
router.get("/profile-posts", getProfilePosts);
router.get("/notification", getNotification);

router
  .route("/:id")
  .get(getUser)
  .patch(uploadUserAvatar, updateUser)
  .delete(deleteUser);

export default router;