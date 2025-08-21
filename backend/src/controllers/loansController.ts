import { Request, Response } from "express";
import { pool } from "../db";

// Middleware should add req.user = { id: number }

export const getLoans = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await pool.query(
    "SELECT *, ROUND((original_amount - amount) / original_amount * 100) AS progress FROM loans WHERE user_id=$1",
    [userId]
  );

  res.json(result.rows);
};
export const addLoan = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount, interest_rate, due_date, type } = req.body;

  const result = await pool.query(
    `INSERT INTO loans
      (user_id, amount, original_amount, interest_rate, due_date, type)
     VALUES ($1,$2,$2,$3,$4,$5)
     RETURNING *`,
    [userId, amount, interest_rate, due_date, type]
  );

  res.status(201).json(result.rows[0]);
};
export const updateLoan = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const { amount, interest_rate, due_date, type } = req.body;
  const result = await pool.query(
    "UPDATE loans SET amount=$1, interest_rate=$2, due_date=$3, type=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
    [amount, interest_rate, due_date, type, id, userId]
  );
  res.json(result.rows[0]);
};

export const deleteLoan = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  await pool.query("DELETE FROM loans WHERE id=$1 AND user_id=$2", [
    id,
    userId,
  ]);
  res.json({ message: "Loan deleted" });
};
