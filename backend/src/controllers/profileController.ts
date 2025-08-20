import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [userId]
  );
  res.json(result.rows[0]);
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const { name, email } = req.body;
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
    [name, email, userId]
  );
  res.json(result.rows[0]);
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const userRes = await pool.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);
  const user = userRes.rows[0];

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match)
    return res.status(400).json({ message: "Incorrect current password" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashed,
    userId,
  ]);
  res.json({ message: "Password changed successfully" });
};

export const deleteAccount = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  res.json({ message: "Account deleted" });
};
