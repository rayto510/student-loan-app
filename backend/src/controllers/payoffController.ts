import { Request, Response } from "express";
import { Loan } from "../models/loan";

interface PayoffResult {
  monthsToPayoff: number;
  totalInterestPaid: number;
  monthlyPayments: number[];
}

// Simple snowball/avalanche calculator
export const calculatePayoff = (req: Request, res: Response) => {
  const { loans, strategy } = req.body; // loans = array of Loan
  if (!loans || loans.length === 0)
    return res.status(400).json({ message: "No loans provided" });

  let sortedLoans: Loan[] = [...loans];

  if (strategy === "snowball") {
    sortedLoans.sort((a, b) => a.amount - b.amount); // smallest debt first
  } else if (strategy === "avalanche") {
    sortedLoans.sort((a, b) => b.interest_rate - a.interest_rate); // highest interest first
  }

  // Simplified calculation: assumes fixed monthly payment = $200
  let totalInterest = 0;
  let months = 0;
  let remainingLoans = sortedLoans.map((loan) => ({ ...loan }));
  const monthlyPayments: number[] = [];

  while (remainingLoans.some((l) => l.amount > 0) && months < 600) {
    months++;
    let monthlyPayment = 200;
    for (let loan of remainingLoans) {
      if (loan.amount <= 0) continue;
      const interest = (loan.amount * (loan.interest_rate / 100)) / 12;
      let principalPayment = Math.min(monthlyPayment, loan.amount + interest);
      loan.amount -= principalPayment - interest;
      totalInterest += interest;
      monthlyPayment -= principalPayment - interest;
      if (monthlyPayment <= 0) break;
    }
    monthlyPayments.push(200 - monthlyPayment);
  }

  const result: PayoffResult = {
    monthsToPayoff: months,
    totalInterestPaid: parseFloat(totalInterest.toFixed(2)),
    monthlyPayments,
  };

  res.json(result);
};
