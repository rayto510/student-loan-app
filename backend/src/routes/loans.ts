import { Router } from "express";
import {
  getLoans,
  addLoan,
  updateLoan,
  deleteLoan,
} from "../controllers/loansController";
import { authenticate } from "../middleware/auth";
import paymentsRouter from "./payments";

const router = Router();

router.get("/", authenticate, getLoans);
router.post("/", authenticate, addLoan);
router.put("/:id", authenticate, updateLoan);
router.delete("/:id", authenticate, deleteLoan);

// Mount payments router under /:id/payments
router.use("/:id/payments", paymentsRouter);

export default router;
