const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchLoans() {
  const res = await fetch(`${API_URL}/loans`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch loans");
  return res.json();
}
