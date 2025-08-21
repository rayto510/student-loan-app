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

export async function updatePassword(
  token: string,
  data: { oldPassword: string; newPassword: string }
) {
  return apiFetch(
    "/profile/change-password",
    { method: "POST", body: JSON.stringify(data) },
    token
  );
}

export async function updateSavePrefs(
  token: string,
  data: { emailNotifications: boolean; smsAlerts: boolean }
) {
  return apiFetch(
    "/profile/preferences",
    { method: "PUT", body: JSON.stringify(data) },
    token
  );
}
