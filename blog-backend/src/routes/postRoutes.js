import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  toggleSavePost,
  getSavedPosts,
  getLikes,
  updatePostStatus,
  getMyPosts,
} from "../controllers/postController.js";
import {
  addComment,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/me", protect, getMyPosts);
router.get("/:id", getPostById);

router.post("/", protect, upload.single("coverImage"), createPost);

router.put("/:id", protect, upload.single("coverImage"), updatePost);
router.put("/:id/status", protect, updatePostStatus);

router.delete("/:id", protect, deletePost);

router.post("/:id/like", protect, toggleLike);
router.get("/:id/like", protect, getLikes);

router.get("/saved", protect, getSavedPosts);
router.put("/:postId/save", protect, toggleSavePost);

router.post("/:postId/comments", protect, addComment);
router.put("/:postId/comments/:commentId", protect, editComment);
router.delete("/:postId/comments/:commentId", protect, deleteComment);

export default router;
