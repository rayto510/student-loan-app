import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getPayments,
  addPayment,
  deletePayment,
} from "../controllers/paymentsController";

const router = express.Router({ mergeParams: true });

router.get("/:id/payments", authenticate, getPayments);
router.post("/:id/payments", authenticate, addPayment);
router.delete("/:id/payments/:paymentId", authenticate, deletePayment);

export default router;
