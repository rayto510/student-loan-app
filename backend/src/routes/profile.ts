import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
} from "../controllers/profileController";

const router = express.Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);
router.delete("/", authenticate, deleteAccount);
router.put("/preferences", authenticate, updatePreferences);

export default router;
