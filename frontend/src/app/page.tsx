import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-6">
      <h1 className="text-3xl font-bold">Welcome to Student Loan Manager</h1>
      <p className="text-slate-600">
        Track your loans, make payments, and see your progress.
      </p>
      <Link href="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </main>
  );
}
