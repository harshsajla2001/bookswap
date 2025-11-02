import express from "express";
import {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus
} from "../controllers/requestController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a request
router.post("/", verifyToken, createRequest);

// Get my sent requests
router.get("/sent", verifyToken, getMyRequests);

// Get requests for my books
router.get("/received", verifyToken, getReceivedRequests);

// Update status (accept/decline)
router.put("/:id/status", verifyToken, updateRequestStatus);

export default router;
