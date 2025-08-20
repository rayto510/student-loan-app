import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/profileController";

const router = express.Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);
router.delete("/", authenticate, deleteAccount);

export default router;
