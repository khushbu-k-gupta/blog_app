import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import admin from '../middlewares/adminMiddleware.js';
import {
  getUsers, deleteUser,
  getAllPosts, editAnyPost, deleteAnyPost, moderateReportedPosts,
  deleteInappropriateComment, moderateFlaggedComments,
  createTag, editTag, deleteTag,
  getAnalytics,
  toggleUserRole,
  toggleBlockUser,
  getTags
} from '../controllers/adminController.js';
import { updatePostTags } from '../controllers/postController.js';

const router = express.Router();
router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/block", toggleBlockUser);
router.put("/users/:id/role", toggleUserRole);

router.get('/posts', getAllPosts);
router.put('/posts/:id', editAnyPost);
router.delete('/posts/:id', deleteAnyPost);
router.get('/posts/reported', moderateReportedPosts);

router.delete('/comments/:commentId', deleteInappropriateComment);
router.get('/comments/reported', moderateFlaggedComments);

router.post('/tags', createTag);
router.get('/tags', getTags);
router.put('/tags/:id', editTag);
router.delete('/tags/:id', deleteTag);
router.put("/posts/:postId/tags", protect, updatePostTags);

router.get('/analytics', getAnalytics);

export default router;
