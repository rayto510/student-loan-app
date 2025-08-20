import { Request, Response } from "express";
import { pool } from "../db";

export const getPayments = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const loanId = req.params.id;

  const result = await pool.query(
    "SELECT * FROM payments WHERE loan_id = $1 AND user_id = $2",
    [loanId, userId]
  );
  res.json(result.rows);
};

export const addPayment = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const loanId = req.params.id;
  const { amount, date } = req.body;

  if (amount <= 0)
    return res.status(400).json({ message: "Payment must be positive" });

  const result = await pool.query(
    "INSERT INTO payments (loan_id, user_id, amount, date) VALUES ($1, $2, $3, $4) RETURNING *",
    [loanId, userId, amount, date]
  );
  res.status(201).json(result.rows[0]);
};

export const deletePayment = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id: loanId, paymentId } = req.params;

  await pool.query(
    "DELETE FROM payments WHERE id = $1 AND loan_id = $2 AND user_id = $3",
    [paymentId, loanId, userId]
  );
  res.json({ message: "Payment deleted" });
};
