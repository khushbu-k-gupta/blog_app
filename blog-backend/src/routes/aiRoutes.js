import express from "express";
import { generatePost, suggestTags } from "../controllers/aiController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate-post", generatePost);
router.post("/suggest-tags", suggestTags);

export default router;
    