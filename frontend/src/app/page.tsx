"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Clock, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Example monthly payment data
const monthlyPayments = [
  { month: "Jan", amount: 300 },
  { month: "Feb", amount: 400 },
  { month: "Mar", amount: 350 },
  { month: "Apr", amount: 450 },
  { month: "May", amount: 500 },
  { month: "Jun", amount: 400 },
];

const loans = [
  { name: "Federal Loan", balance: 7200, progress: 50 },
  { name: "Private Loan", balance: 5250, progress: 75 },
  { name: "Parent PLUS Loan", balance: 3000, progress: 20 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 shrink-0">
              <DollarSign className="w-5 h-5 text-indigo-600" /> Total Balance
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-slate-800 truncate max-w-[6rem] sm:max-w-[8rem]"
            >
              $12,450
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={60} className="h-2 rounded-full" />
            <p className="mt-2 text-sm text-slate-600">
              60% of total loans paid off
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 shrink-0">
              <Clock className="w-5 h-5 text-indigo-600" /> Next Payment
            </CardTitle>
            <Badge
              variant="destructive"
              className="text-slate-50 bg-red-600 truncate max-w-[5rem] sm:max-w-[6rem]"
            >
              $350
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Due in 5 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 shrink-0">
              <ArrowUp className="w-5 h-5 text-green-600" /> Payments This Month
            </CardTitle>
            <Badge
              variant="outline"
              className="truncate max-w-[5rem] sm:max-w-[6rem]"
            >
              + $1,200
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">3 payments completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Payments Chart */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
        Monthly Payments
      </h2>
      <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyPayments}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Loan Overview */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
        Loans Overview
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <Card
            key={loan.name}
            className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group"
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 shrink-0">
                <DollarSign className="w-5 h-5 text-indigo-600" /> {loan.name}
              </CardTitle>
              <Badge className="truncate max-w-[5rem] sm:max-w-[6rem]">
                ${loan.balance}
              </Badge>
            </CardHeader>
            <CardContent>
              <Progress value={loan.progress} className="h-2 rounded-full" />
              <p className="mt-2 text-sm text-slate-600">
                {loan.progress}% paid off
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
