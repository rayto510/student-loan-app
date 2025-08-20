import request from "supertest";
import { app } from "./setup"; // Assuming you have an app export in your main app file

jest.mock("../src/middleware/auth", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 1 };
    next();
  },
}));

jest.mock("../src/db", () => ({
  pool: {
    query: jest.fn((query: string, params: any[]) => {
      if (query.includes("SELECT * FROM notifications")) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              user_id: params[0],
              message: "Pay loan",
              date: "2025-09-01",
            },
          ],
        });
      }
      if (query.includes("INSERT INTO notifications")) {
        return Promise.resolve({
          rows: [
            { id: 2, user_id: params[0], message: params[1], date: params[2] },
          ],
        });
      }
      if (query.includes("UPDATE notifications")) {
        return Promise.resolve({
          rows: [
            {
              id: params[2],
              user_id: params[3],
              message: params[0],
              date: params[1],
            },
          ],
        });
      }
      if (query.includes("DELETE FROM notifications")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    }),
  },
}));

describe("Notifications Controller", () => {
  it("should get notifications", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].message).toBe("Pay loan");
  });

  it("should add a notification", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .send({ message: "Call bank", date: "2025-09-05" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Call bank");
  });

  it("should update a notification", async () => {
    const res = await request(app)
      .put("/api/notifications/2")
      .send({ message: "Email bank", date: "2025-09-06" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Email bank");
  });

  it("should delete a notification", async () => {
    const res = await request(app).delete("/api/notifications/2");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Notification deleted");
  });
});
