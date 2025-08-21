"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Clock } from "lucide-react";
import { getLoans } from "@/lib/loan";

type Loan = {
  id: string | number;
  amount: number;
  interest_rate: number;
  due_date: string;
  type: string;
  original_amount?: number;
};

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    getLoans(token).then((data) => {
      setLoans(data);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p>Loading...</p>;

  const totalBalance = loans.reduce(
    (sum, loan) => sum + Number(loan.amount),
    0
  );
  const totalInterest = loans.reduce(
    (sum, loan) =>
      sum + (Number(loan.amount) * Number(loan.interest_rate)) / 100,
    0
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" /> Total Balance
            </CardTitle>
            <span className="text-slate-800 truncate max-w-[6rem] sm:max-w-[8rem]">
              <Badge variant="default">${totalBalance.toLocaleString()}</Badge>
            </span>
          </CardHeader>
          <CardContent>
            <Progress
              value={0} // Placeholder, you can compute % paid off
              className="h-2 rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" /> Total Interest
            </CardTitle>
            <span className="text-green-600 truncate max-w-[6rem] sm:max-w-[8rem]">
              <Badge>${totalInterest.toLocaleString()}</Badge>
            </span>
          </CardHeader>
        </Card>

        {/* Optional: Next Payment Card */}
        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Next Payment
            </CardTitle>
            <span className="text-slate-800 truncate max-w-[6rem] sm:max-w-[8rem]">
              <Badge>$350</Badge>
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Due in 5 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Overview */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
        Loans Overview
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <Card
            key={loan.id}
            className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group"
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" /> {loan.type}
              </CardTitle>
              <span className="truncate max-w-[5rem] sm:max-w-[6rem]">
                <Badge>${Number(loan.amount).toLocaleString()}</Badge>
              </span>
            </CardHeader>
            <CardContent className="space-y-1">
              {loan.original_amount && (
                <p className="text-slate-500">
                  Original: ${Number(loan.original_amount).toLocaleString()}
                </p>
              )}
              <p className="text-slate-500">
                Interest: {Number(loan.interest_rate)}%
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
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
