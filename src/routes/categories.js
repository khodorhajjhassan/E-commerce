import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  getCategoryByName,
  updateCategory,
} from "../controllers/category.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// GET All category
router.get("/", getAllCategories);
router.get("/q", verifyAdmin, getAllCategories);
// GET a SPECIFIC category
router.get("/:id", getCategory); //getCategoryByName
router.get("/name/:name", getCategoryByName);
// POST a new category
//router.post('/',verifyAdmin,createCategory);
router.post("/", verifyAdmin, createCategory);
// PUT (update) a category by ID
router.put("/:id", verifyAdmin, updateCategory);

// DELETE a category by ID
router.delete("/:id", verifyAdmin, deleteCategory);

export default router;
