"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getLoans, addLoan } from "@/lib/loan";
import ProtectedRoute from "@/components/ProtectedRoute";

type Loan = {
  id: string | number;
  amount: number;
  progress: number;
  original_amount: number;
  interest_rate: number;
  due_date: string;
  type: string;
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    getLoans(token).then((data) => {
      setLoans(data);
    });
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
        <div className="mb-6 p-6 border rounded-2xl bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add a New Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              placeholder="Loan Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Interest Rate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={handleAddLoan}
            className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto"
          >
            Add Loan
          </Button>
        </div>

        {/* Loan Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <Card
              key={loan.id}
              className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  {loan.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">
                  Balance: ${Number(loan.amount).toLocaleString()}
                </p>
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
                  value={Number(loan.progress)}
                  className="mt-2 h-3 rounded-full bg-slate-200"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
