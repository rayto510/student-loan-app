import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getPayments,
  addPayment,
  deletePayment,
} from "../controllers/paymentsController";

const router = express.Router({ mergeParams: true }); // keeps loanId from parent

// The routes are relative to /api/loans/:loanId/payments
router.get("/", authenticate, getPayments);
router.post("/", authenticate, addPayment);
router.delete("/:paymentId", authenticate, deletePayment);

export default router;
