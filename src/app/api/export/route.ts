import { NextRequest, NextResponse } from "next/server";
import type { Receipt } from "@/lib/types";

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const { receipts } = (await request.json()) as { receipts: Receipt[] };

    const headers = [
      "Receipt ID",
      "File Name",
      "Vendor",
      "Date",
      "Item Description",
      "Quantity",
      "Unit Price",
      "Item Total",
      "Category",
      "Category Explanation",
      "Receipt Subtotal",
      "Receipt Tax",
      "Receipt Total",
      "Currency",
    ];

    const rows: string[][] = [];

    for (const receipt of receipts) {
      for (const item of receipt.lineItems) {
        rows.push([
          receipt.id,
          receipt.fileName,
          receipt.vendor,
          receipt.date,
          item.description,
          String(item.quantity),
          String(item.unitPrice),
          String(item.total),
          item.category,
          item.categoryExplanation,
          String(receipt.subtotal),
          String(receipt.tax),
          String(receipt.total),
          receipt.currency,
        ]);
      }
    }

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="receipts-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
