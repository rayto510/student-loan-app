import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import loansRoutes from "./routes/loans";
import payoffRoutes from "./routes/payoff";
import notificationsRoutes from "./routes/notifications";
import profileRoutes from "./routes/profile";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/payoff", payoffRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
