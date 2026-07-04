import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { createPost, getPosts, getPostById, updatePost, deletePost, toggleLike, searchPosts, toggleSavePost, getSavedPosts, getLikes, updatePostStatus } from '../controllers/postController.js';
import { addComment, editComment, deleteComment } from '../controllers/commentController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get("/saved", protect, getSavedPosts);
router.get('/', protect,getPosts);
router.get('/search', searchPosts);
router.post('/', protect, upload.single('coverImage'), createPost);
router.get('/:id', getPostById);
router.put('/:id', protect, upload.single('coverImage'), updatePost);
router.put("/:id/status", protect, updatePostStatus);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.get('/:id/like', protect, getLikes);

router.post('/:postId/comments', protect, addComment);
router.put('/:postId/comments/:commentId', protect, editComment);
router.delete('/:postId/comments/:commentId', protect, deleteComment);


router.put("/:postId/save", protect, toggleSavePost);
export default router;
