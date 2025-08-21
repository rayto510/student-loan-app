import { apiFetch } from "./api";

export async function getProfile(token: string) {
  return apiFetch("/profile", {}, token);
}

export async function updateProfile(
  token: string,
  data: { name: string; email: string }
) {
  return apiFetch(
    "/profile",
    { method: "PUT", body: JSON.stringify(data) },
    token
  );
}
