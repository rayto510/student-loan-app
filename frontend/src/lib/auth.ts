// lib/auth.ts
import { apiFetch } from "./api";

export async function signup(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: { email: string; password: string }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
