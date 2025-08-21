"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const loans = [
  {
    id: 1,
    name: "Federal Loan",
    balance: 12000,
    interest_rate: 5,
    progress: 30,
  },
  {
    id: 2,
    name: "Private Loan",
    balance: 8000,
    interest_rate: 7,
    progress: 45,
  },
  { id: 3, name: "Parent PLUS", balance: 5000, interest_rate: 6, progress: 10 },
];

export default function LoansPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Your Loans</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <Card
            key={loan.id}
            className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300"
          >
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                {loan.name}
              </CardTitle>
              {loan.progress >= 40 && (
                <Badge variant="success">Milestone!</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-bold text-slate-900">
                ${loan.balance.toLocaleString()}
              </p>
              <p className="text-slate-500">Interest: {loan.interest_rate}%</p>
              <Progress
                value={loan.progress}
                className="mt-2 h-3 rounded-full bg-slate-200"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
