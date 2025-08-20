export interface Loan {
  id?: number;
  user_id: number;
  amount: number;
  interest_rate: number; // percent
  due_date: string; // ISO string
  type: "federal" | "private";
}
