import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Receipt & Invoice Tracker",
  description:
    "Upload receipts and invoices, extract line items, categorize spending, and export to CSV.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
