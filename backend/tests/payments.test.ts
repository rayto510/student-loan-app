import request from "supertest";
import express from "express";
import paymentsRoutes from "../src/routes/payments";

jest.mock("../src/middleware/auth", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 1 };
    next();
  },
}));

jest.mock("../src/db", () => ({
  pool: {
    query: jest.fn((query: string, params: any[]) => {
      if (query.includes("SELECT * FROM payments")) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              loan_id: params[0],
              user_id: params[1],
              amount: 100,
              date: "2025-09-01",
            },
          ],
        });
      }
      if (query.includes("INSERT INTO payments")) {
        return Promise.resolve({
          rows: [
            {
              id: 2,
              loan_id: params[0],
              user_id: params[1],
              amount: params[2],
              date: params[3],
            },
          ],
        });
      }
      if (query.includes("DELETE FROM payments")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    }),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/loans", paymentsRoutes);

describe("Payments Controller", () => {
  it("should get payments", async () => {
    const res = await request(app).get("/api/loans/1/payments");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].amount).toBe(100);
  });

  it("should add a payment", async () => {
    const res = await request(app)
      .post("/api/loans/1/payments")
      .send({ amount: 200, date: "2025-09-05" });
    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(200);
  });

  it("should fail to add negative payment", async () => {
    const res = await request(app)
      .post("/api/loans/1/payments")
      .send({ amount: -100, date: "2025-09-05" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Payment must be positive");
  });

  it("should delete a payment", async () => {
    const res = await request(app).delete("/api/loans/1/payments/2");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Payment deleted");
  });
});
