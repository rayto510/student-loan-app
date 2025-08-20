import request from "supertest";
import express from "express";
import payoffRoutes from "../src/routes/payoff";

const app = express();
app.use(express.json());
app.use("/api/payoff", payoffRoutes);

jest.mock("../src/db", () => ({
  pool: {
    query: jest.fn((query: string, params: any[]) => {
      if (query.includes("INSERT INTO users")) {
        return Promise.resolve({
          rows: [{ id: 1, name: params[0], email: params[1] }],
        });
      }
      if (query.includes("SELECT * FROM users")) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              name: "Test User",
              email: params[0],
              password: "$2b$10$hashed",
            },
          ],
        });
      }
    }),
  },
}));

jest.mock("../src/middleware/auth", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 1 }; // fake user for testing
    next();
  },
}));

describe("Payoff Controller", () => {
  it("should calculate payoff using snowball strategy", async () => {
    const loans = [
      { amount: 5000, interest_rate: 5 },
      { amount: 2000, interest_rate: 8 },
    ];

    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans, strategy: "snowball" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("monthsToPayoff");
    expect(res.body).toHaveProperty("totalInterestPaid");
    expect(res.body.monthlyPayments.length).toBeGreaterThan(0);
  });

  it("should calculate payoff using avalanche strategy", async () => {
    const loans = [
      { amount: 3000, interest_rate: 6 },
      { amount: 1000, interest_rate: 10 },
    ];

    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans, strategy: "avalanche" });

    expect(res.statusCode).toBe(200);
    expect(res.body.monthlyPayments.length).toBeGreaterThan(0);
  });

  it("should return 400 if loans array is empty", async () => {
    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans: [], strategy: "snowball" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No loans provided");
  });

  it("should handle negative loan amounts gracefully", async () => {
    const loans = [
      { amount: -5000, interest_rate: 5 },
      { amount: 2000, interest_rate: 8 },
    ];

    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans, strategy: "snowball" });

    expect(res.statusCode).toBe(200);
    expect(res.body.monthlyPayments.length).toBeGreaterThan(0);
  });

  it("should handle zero interest rates", async () => {
    const loans = [
      { amount: 3000, interest_rate: 0 },
      { amount: 1000, interest_rate: 0 },
    ];

    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans, strategy: "avalanche" });

    expect(res.statusCode).toBe(200);
    expect(res.body.totalInterestPaid).toBe(0);
  });

  it("should handle large number of loans", async () => {
    const loans = Array.from({ length: 100 }, (_, i) => ({
      amount: 1000 + i * 10,
      interest_rate: 5,
    }));

    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans, strategy: "snowball" });

    expect(res.statusCode).toBe(200);
    expect(res.body.monthlyPayments.length).toBeGreaterThan(0);
  });

  it("should default to snowball strategy if invalid strategy provided", async () => {
    const loans = [
      { amount: 2000, interest_rate: 5 },
      { amount: 1000, interest_rate: 7 },
    ];

    const res = await request(app)
      .post("/api/payoff/calculate")
      .send({ loans, strategy: "invalid-strategy" });

    expect(res.statusCode).toBe(200);
    expect(res.body.monthlyPayments.length).toBeGreaterThan(0);
  });
});
