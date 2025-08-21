"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPayments, addPayment, deletePayment } from "@/lib/payments";

type Payment = {
  id: number;
  amount: number;
  date: string;
};

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = Number(params.id);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!token) return;
    getPayments(token, loanId).then(setPayments);
  }, [token, loanId]);

  const handleAddPayment = async () => {
    if (!token) return;

    // Convert amount to number before sending to backend
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    await addPayment(token, loanId, {
      amount: numericAmount,
      date,
    });

    setAmount("");
    setDate("");
    // Ensure the amount in state is a number
    await getPayments(token, loanId).then(setPayments);
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (!token) return;
    try {
      await deletePayment(token, loanId, paymentId);
      setPayments(payments.filter((p) => p.id !== paymentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Loan Payments</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Add Payment Form */}
      <Card className="mb-6 shadow-lg rounded-2xl border border-slate-200">
        <CardHeader>
          <CardTitle>Add Payment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button onClick={handleAddPayment}>Add Payment</Button>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.length === 0 && (
          <p className="text-slate-500">No payments recorded yet.</p>
        )}
        {payments
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((p) => (
            <Card
              key={p.id}
              className="flex justify-between items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Left side - Payment info */}
              <div className="flex flex-col">
                <p className="text-xl font-bold text-slate-800">
                  ${Number(p.amount ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {p.date
                    ? new Date(p.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "No date"}
                </p>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="destructive"
                  className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500"
                  onClick={() => handleDeletePayment(p.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </DashboardLayout>
  );
}
