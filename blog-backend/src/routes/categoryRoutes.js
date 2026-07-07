import express from "express";
import protect from "../middlewares/authMiddleware.js";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import admin from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", protect,admin, createCategory);

router.put("/:id", protect, updateCategory);

router.delete("/:id", protect, deleteCategory);

export default router;