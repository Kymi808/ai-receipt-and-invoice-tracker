"use client";

import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ReceiptCard from "@/components/ReceiptCard";
import SpendSummary from "@/components/SpendSummary";
import type { Receipt } from "@/lib/types";

export default function Home() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process file");
      }

      setReceipts((prev) => [data as Receipt, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipts }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipts-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export CSV");
    }
  }, [receipts]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Receipt & Invoice Tracker
        </h1>
        <p className="text-gray-500 mt-1">
          Upload receipts or invoices to extract line items, categorize spending,
          and export to CSV.
        </p>
      </div>

      {/* Upload area */}
      <FileUpload onUpload={handleUpload} isLoading={isLoading} />

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Results */}
      {receipts.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Receipts ({receipts.length})
            </h2>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Export CSV
            </button>
          </div>

          {/* Spend summary */}
          <SpendSummary receipts={receipts} />

          {/* Receipt cards */}
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
