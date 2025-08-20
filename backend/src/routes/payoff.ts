import { Router } from "express";
import { calculatePayoff } from "../controllers/payoffController";

const router = Router();

router.post("/calculate", calculatePayoff);

export default router;
