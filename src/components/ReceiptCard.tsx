"use client";

import { useState } from "react";
import type { Receipt } from "@/lib/types";
import CategoryExplanation from "./CategoryExplanation";

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete: (id: string) => void;
}

export default function ReceiptCard({ receipt, onDelete }: ReceiptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold truncate">{receipt.vendor}</h3>
            <span className="text-sm text-gray-500 shrink-0">
              {receipt.date}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{receipt.fileName}</p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className="text-xl font-bold text-green-700">
            {receipt.currency === "USD" ? "$" : receipt.currency}
            {receipt.total.toFixed(2)}
          </span>
          <button
            onClick={() => onDelete(receipt.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Remove"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {expanded ? "Hide" : "Show"} Line Items ({receipt.lineItems.length})
        </button>
        <button
          onClick={() => setShowExplanations(!showExplanations)}
          className="text-sm px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
        >
          {showExplanations ? "Hide" : "Why this category?"}
        </button>
      </div>

      {/* Line items table */}
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-4 font-medium text-gray-600">
                    Item
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600">
                    Qty
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600">
                    Unit Price
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600">
                    Total
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-gray-600">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {receipt.lineItems.map((item, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-2 px-4">{item.description}</td>
                    <td className="py-2 px-4 text-right">{item.quantity}</td>
                    <td className="py-2 px-4 text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right font-medium">
                      ${item.total.toFixed(2)}
                    </td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr className="border-t border-gray-200">
                  <td className="py-2 px-4" colSpan={3}>
                    Subtotal
                  </td>
                  <td className="py-2 px-4 text-right">
                    ${receipt.subtotal.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td className="py-2 px-4" colSpan={3}>
                    Tax
                  </td>
                  <td className="py-2 px-4 text-right">
                    ${receipt.tax.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr className="text-green-700">
                  <td className="py-2 px-4 font-bold" colSpan={3}>
                    Total
                  </td>
                  <td className="py-2 px-4 text-right font-bold">
                    ${receipt.total.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Category explanations */}
      {showExplanations && (
        <CategoryExplanation lineItems={receipt.lineItems} />
      )}
    </div>
  );
}
