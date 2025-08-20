import { Router } from "express";
import {
  getLoans,
  addLoan,
  updateLoan,
  deleteLoan,
} from "../controllers/loansController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getLoans);
router.post("/", authenticate, addLoan);
router.put("/:id", authenticate, updateLoan);
router.delete("/:id", authenticate, deleteLoan);

export default router;
