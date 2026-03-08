"use client";

import type { LineItem } from "@/lib/types";

interface CategoryExplanationProps {
  lineItems: LineItem[];
}

export default function CategoryExplanation({
  lineItems,
}: CategoryExplanationProps) {
  return (
    <div className="border-t border-purple-100 bg-purple-50/50 p-4">
      <h4 className="text-sm font-semibold text-purple-800 mb-3">
        Why This Category?
      </h4>
      <div className="space-y-2">
        {lineItems.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 text-sm bg-white rounded-lg p-3 border border-purple-100"
          >
            <div className="shrink-0">
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {item.category}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-800">
                {item.description}
              </span>
              <p className="text-gray-600 mt-0.5">{item.categoryExplanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
