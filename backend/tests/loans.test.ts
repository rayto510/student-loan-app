import request from "supertest";
import express from "express";
import loanRoutes from "../src/routes/loans";
import { pool } from "../src/db";

jest.mock("../src/db", () => ({
  pool: {
    query: jest.fn((query: string, params: any[]) => {
      if (query.startsWith("SELECT * FROM loans")) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              user_id: 1,
              amount: 1000,
              interest_rate: 5,
              due_date: "2025-09-01",
              type: "federal",
            },
          ],
        });
      }
      if (query.startsWith("INSERT INTO loans")) {
        return Promise.resolve({
          rows: [
            {
              id: 2,
              user_id: params[0],
              amount: params[1],
              interest_rate: params[2],
              due_date: params[3],
              type: params[4],
            },
          ],
        });
      }
      if (query.startsWith("UPDATE loans")) {
        return Promise.resolve({
          rows: [
            {
              id: params[4],
              user_id: params[5],
              amount: params[0],
              interest_rate: params[1],
              due_date: params[2],
              type: params[3],
            },
          ],
        });
      }
      if (query.startsWith("DELETE FROM loans")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    }),
  },
}));

// Mock authenticate middleware
jest.mock("../src/middleware/auth", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 1 };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/loans", loanRoutes);

describe("Loans Controller", () => {
  it("should get all loans for user", async () => {
    const res = await request(app).get("/api/loans");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].amount).toBe(1000);
  });

  it("should add a new loan", async () => {
    const res = await request(app).post("/api/loans").send({
      amount: 2000,
      interest_rate: 4,
      due_date: "2025-10-01",
      type: "private",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(2000);
    expect(res.body.type).toBe("private");
  });

  it("should update a loan", async () => {
    const res = await request(app).put("/api/loans/1").send({
      amount: 1500,
      interest_rate: 5,
      due_date: "2025-11-01",
      type: "federal",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(1500);
  });

  it("should delete a loan", async () => {
    const res = await request(app).delete("/api/loans/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Loan deleted");
  });
});
