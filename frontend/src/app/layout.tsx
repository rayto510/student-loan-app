import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Student Loan Manager",
  description: "Track and pay off your student loans with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-slate-50 text-slate-900", inter.className)}>
        {children}
      </body>
    </html>
  );
}
