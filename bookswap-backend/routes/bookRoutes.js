import express from "express";
import {
  addBook,
  getAllBooks,
  getMyBooks,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Add a book
router.post("/", verifyToken, upload.single("image"), addBook);

// Get all books (public)
router.get("/", verifyToken, getAllBooks);

// Get logged-in user's books
router.get("/my", verifyToken, getMyBooks);

// Update and delete books (only owner)
router.put("/:id", verifyToken, updateBook);
router.delete("/:id", verifyToken, deleteBook);

export default router;
