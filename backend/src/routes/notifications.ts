import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationsController";

const router = express.Router();
router.use(authenticate);

router.get("/", getNotifications);
router.post("/", addNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
