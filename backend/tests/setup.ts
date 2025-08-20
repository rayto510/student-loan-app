import express from "express";
import authRoutes from "../src/routes/auth";
import notificationsRoutes from "../src/routes/notifications";
import profileRoutes from "../src/routes/profile";
import loansRoutes from "../src/routes/loans";
import payoffRoutes from "../src/routes/payoff";

export const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/payoff", payoffRoutes);
