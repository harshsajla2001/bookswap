import express from "express";
import {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus
} from "../controllers/requestController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createRequest);

router.get("/sent", verifyToken, getMyRequests);

router.get("/received", verifyToken, getReceivedRequests);

router.put("/:id/status", verifyToken, updateRequestStatus);

export default router;
