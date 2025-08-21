import { apiFetch } from "./api";

interface Loan {
  amount: number;
  interest_rate: number;
  due_date: string;
  type: string;
}

export async function getLoans(token: string) {
  return apiFetch("/loans", {}, token);
}

export async function addLoan(
  token: string,
  loan: {
    amount: number;
    interest_rate: number;
    due_date: string;
    type: string;
  }
) {
  return apiFetch(
    "/loans",
    { method: "POST", body: JSON.stringify(loan) },
    token
  );
}

export async function updateLoan(token: string, id: number, loan: Loan) {
  return apiFetch(
    `/loans/${id}`,
    { method: "PUT", body: JSON.stringify(loan) },
    token
  );
}

export async function deleteLoan(token: string, id: number) {
  return apiFetch(`/loans/${id}`, { method: "DELETE" }, token);
}
