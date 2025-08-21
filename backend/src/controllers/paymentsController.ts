import { Request, Response } from "express";
import { pool } from "../db";

export const getPayments = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const loanId = Number(req.params.id);
  if (!loanId)
    return res.status(400).json({ message: "Missing or invalid loan ID" });

  const result = await pool.query(
    "SELECT * FROM payments WHERE loan_id = $1 AND user_id = $2 ORDER BY date DESC",
    [loanId, userId]
  );
  res.json(result.rows);
};

export const addPayment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const loanId = Number(req.params.id);
  if (!loanId)
    return res.status(400).json({ message: "Missing or invalid loan ID" });

  const { amount, date } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Payment must be positive" });

  const paymentDate = new Date(date);
  if (isNaN(paymentDate.getTime())) {
    return res.status(400).json({ message: "Invalid date" });
  }

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert payment
    const paymentResult = await client.query(
      "INSERT INTO payments (loan_id, user_id, amount, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [loanId, userId, amount, paymentDate.toISOString()]
    );

    // Deduct from loan balance
    await client.query(
      "UPDATE loans SET amount = amount - $1 WHERE id = $2 AND user_id = $3",
      [amount, loanId, userId]
    );

    await client.query("COMMIT");

    res.status(201).json(paymentResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message: string }).message
        : String(err);
    res.status(500).json({ message: "Server error", error: errorMessage });
  } finally {
    client.release();
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const loanId = Number(req.params.id);
  const paymentId = Number(req.params.paymentId);

  if (!loanId || !paymentId)
    return res.status(400).json({ message: "Missing loan ID or payment ID" });

  await pool.query(
    "DELETE FROM payments WHERE id = $1 AND loan_id = $2 AND user_id = $3",
    [paymentId, loanId, userId]
  );
  res.json({ message: "Payment deleted" });
};
