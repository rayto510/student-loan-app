import request from "supertest";
import { pool } from "../src/db";
import bcrypt from "bcrypt";
import { app } from "./setup"; // Assuming you have an app export in your main app file
import jwt from "jsonwebtoken";

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
              password: bcrypt.hashSync("password123", 10),
            },
          ],
        });
      }
      return Promise.resolve({ rows: [] });
    }),
  },
}));

describe("Auth Controller", () => {
  it("should signup a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("alice@example.com");
    expect(res.body.token).toBeDefined();
  });

  it("should fail signup if email exists", async () => {
    (pool.query as any).mockImplementationOnce(() => {
      const err: any = new Error();
      err.code = "23505";
      throw err;
    });

    const res = await request(app).post("/api/auth/signup").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.token).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should fail login with non-existent email", async () => {
    (pool.query as any).mockImplementationOnce(() =>
      Promise.resolve({ rows: [] })
    );

    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
