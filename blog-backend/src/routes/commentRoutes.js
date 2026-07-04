import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  getComments,
} from "../controllers/commentController.js";
import protect from "../middlewares/authMiddleware.js";
import { getAllComments, updateCommentStatus } from "../controllers/adminController.js";
const router = express.Router();
router.get("/post/:postId", getComments);
router.post("/post/:postId", protect, addComment);
router.put("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);
router.get("/", protect, getAllComments);
router.patch("/:id/status", protect, updateCommentStatus);
export default router;
