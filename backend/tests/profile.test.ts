import request from "supertest";
import { app } from "./setup"; // Assuming you have an app export in your main app file

// Mock authenticate middleware
jest.mock("../src/middleware/auth", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 1 };
    next();
  },
}));

// Mock database
jest.mock("../src/db", () => {
  const bcrypt = require("bcryptjs");
  const hash = bcrypt.hashSync("oldpass", 1); // use small salt rounds for speed in tests

  return {
    pool: {
      query: jest.fn((query: string, params: any[]) => {
        // Return user for change password queries
        if (query.includes("FROM users WHERE id")) {
          return Promise.resolve({
            rows: [
              {
                id: 1,
                name: "Alice",
                email: "alice@example.com",
                password: hash,
                email_notifications: true,
                sms_alerts: false,
              },
            ],
          });
        }
        // Handle profile update
        if (query.startsWith("UPDATE users SET name")) {
          return Promise.resolve({
            rows: [{ id: 1, name: params[0], email: params[1] }],
          });
        }
        // Handle password update
        if (query.startsWith("UPDATE users SET password")) {
          return Promise.resolve({ rows: [] });
        }
        // Handle preference update
        if (query.startsWith("UPDATE users SET email_notifications")) {
          return Promise.resolve({
            rows: [
              { id: 1, email_notifications: params[0], sms_alerts: params[1] },
            ],
          });
        }

        // Handle delete
        if (query.startsWith("DELETE FROM users")) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      }),
    },
  };
});

describe("Profile Controller", () => {
  it("should get profile", async () => {
    const res = await request(app).get("/api/profile");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice");
    expect(res.body.email).toBe("alice@example.com");
  });

  it("should update profile", async () => {
    const res = await request(app)
      .put("/api/profile")
      .send({ name: "Bob", email: "bob@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Bob");
    expect(res.body.email).toBe("bob@example.com");
  });

  it("should change password successfully", async () => {
    const res = await request(app)
      .post("/api/profile/change-password")
      .send({ oldPassword: "oldpass", newPassword: "newpass" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password changed successfully");
  });

  it("should handle updating preferences", async () => {
    const res = await request(app)
      .put("/api/profile/preferences")
      .send({ emailNotifications: false, smsAlerts: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.email_notifications).toBe(false);
    expect(res.body.sms_alerts).toBe(true);
  });

  it("should fail change password with wrong old password", async () => {
    const res = await request(app)
      .post("/api/profile/change-password")
      .send({ oldPassword: "wrong", newPassword: "newpass" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Incorrect current password");
  });

  it("should delete account", async () => {
    const res = await request(app).delete("/api/profile");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Account deleted");
  });
});
