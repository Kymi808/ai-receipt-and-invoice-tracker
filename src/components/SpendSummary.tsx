"use client";

import type { Receipt } from "@/lib/types";

interface SpendSummaryProps {
  receipts: Receipt[];
}

export default function SpendSummary({ receipts }: SpendSummaryProps) {
  if (receipts.length === 0) return null;

  const categoryTotals: Record<string, number> = {};
  let grandTotal = 0;

  for (const receipt of receipts) {
    for (const item of receipt.lineItems) {
      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) + item.total;
      grandTotal += item.total;
    }
  }

  const sorted = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
  const maxVal = sorted[0]?.[1] || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4">Spend by Category</h2>
      <div className="space-y-3">
        {sorted.map(([category, total]) => {
          const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
          const barWidth = (total / maxVal) * 100;
          return (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-600">
                  ${total.toFixed(2)}{" "}
                  <span className="text-gray-400">({pct.toFixed(1)}%)</span>
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-semibold">
        <span>Total</span>
        <span className="text-green-700">${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
