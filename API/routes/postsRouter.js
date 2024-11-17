import express from "express";
import { getPost, getPosts, createPost, editPost, deletePost, markFavorite} from "../controllers/postController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadPostImages } from "../middlewares/uploads.js";

const router = express.Router();

router.route("/").get(getPosts).post(verifyToken, uploadPostImages, createPost);
router
  .route("/:id")
  .get(getPost)
  .patch(verifyToken, uploadPostImages, editPost)
  .delete(verifyToken, deletePost);
  
router.patch("/mark-favorite/:id", verifyToken, markFavorite)

export default router;
