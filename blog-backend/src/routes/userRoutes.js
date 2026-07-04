import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { updateProfile, changePassword, getTagsForUsers } from '../controllers/userController.js';

const router = express.Router();
router.use(protect);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get("/tags", protect, getTagsForUsers);


export default router;
