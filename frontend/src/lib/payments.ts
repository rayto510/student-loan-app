import { apiFetch } from "./api";

export async function getPayments(token: string, loanId: number) {
  return apiFetch(`/loans/${loanId}/payments`, {}, token);
}

export async function addPayment(
  token: string,
  loanId: number,
  payment: { amount: number; date: string }
) {
  return apiFetch(
    `/loans/${loanId}/payments`,
    { method: "POST", body: JSON.stringify(payment) },
    token
  );
}

export async function deletePayment(
  token: string,
  loanId: number,
  paymentId: number
) {
  return apiFetch(
    `/loans/${loanId}/payments/${paymentId}`,
    { method: "DELETE" },
    token
  );
}
