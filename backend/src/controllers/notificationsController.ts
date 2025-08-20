import { Request, Response } from "express";
import { pool } from "../db";

export const getNotifications = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const result = await pool.query(
    "SELECT * FROM notifications WHERE user_id = $1",
    [userId]
  );
  res.json(result.rows);
};

export const addNotification = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const { message, date } = req.body;
  const result = await pool.query(
    "INSERT INTO notifications (user_id, message, date) VALUES ($1, $2, $3) RETURNING *",
    [userId, message, date]
  );
  res.status(201).json(result.rows[0]);
};

export const updateNotification = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const { id } = req.params;
  const { message, date } = req.body;
  const result = await pool.query(
    "UPDATE notifications SET message = $1, date = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
    [message, date, id, userId]
  );
  res.json(result.rows[0]);
};

export const deleteNotification = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.id;
  const { id } = req.params;
  await pool.query("DELETE FROM notifications WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
  res.json({ message: "Notification deleted" });
};
