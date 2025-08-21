"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getLoans, addLoan } from "@/lib/loan";
import ProtectedRoute from "@/components/ProtectedRoute";

type Loan = {
  id: string | number;
  amount: number;
  interest_rate: number;
  due_date: string;
  type: string;
  original_amount?: number;
  progress: number;
};

export default function LoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);

  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    getLoans(token).then((data) => setLoans(data));
  }, [token]);

  const handleAddLoan = async () => {
    if (!token) return;
    const newLoan = await addLoan(token, {
      amount: Number(amount),
      interest_rate: Number(interestRate),
      due_date: dueDate,
      type,
    });
    setLoans([...loans, newLoan]);
    setAmount("");
    setInterestRate("");
    setDueDate("");
    setType("");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-6">Your Loans</h1>

        {/* Add Loan Form */}
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Add a New Loan</h2>
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              placeholder="Loan Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="number"
              placeholder="Interest Rate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <Button onClick={handleAddLoan}>Add Loan</Button>
        </div>

        {/* Loan Cards */}
        {loans.length === 0 ? (
          <p className="text-slate-600">
            You have no loans yet. Add one above!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => (
              <Card
                key={loan.id}
                className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/loans/${loan.id}`)}
              >
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {loan.type}
                  </CardTitle>
                  <span className="truncate max-w-[5rem] sm:max-w-[6rem]">
                    <Badge>${Number(loan.amount).toLocaleString()}</Badge>
                  </span>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loan.original_amount && (
                    <p className="text-slate-500">
                      Original: ${Number(loan.original_amount).toLocaleString()}
                    </p>
                  )}
                  <p className="text-slate-500">
                    Interest: {loan.interest_rate}%
                  </p>
                  <p
                    className={`${
                      new Date(loan.due_date) < new Date()
                        ? "text-red-600 font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    Due:{" "}
                    {new Date(loan.due_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <Progress
                    value={loan.progress}
                    className="h-3 rounded-full"
                  />
                  <p className="text-sm text-slate-600">
                    {loan.progress}% paid off
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
