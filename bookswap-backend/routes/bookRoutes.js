import express from "express";
import {
  addBook,
  getAllBooks,
  getMyBooks,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/upload.js";

const router = express.Router();

router.post("/", verifyToken, uploadSingle("image"), addBook);

router.get("/", verifyToken, getAllBooks);

router.get("/my", verifyToken, getMyBooks);

router.put("/:id", verifyToken, updateBook);
router.delete("/:id", verifyToken, deleteBook);

export default router;
