import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CATEGORIES, type Receipt } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Please upload an image (JPEG/PNG) or PDF file" },
        { status: 400 }
      );
    }

    const mediaType = isPdf
      ? "application/pdf"
      : (file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp");

    const contentBlock = isPdf
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mediaType as
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp",
            data: base64,
          },
        };

    const categoriesList = CATEGORIES.join(", ");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: `Analyze this receipt or invoice image. Extract all information and return a JSON object with this exact structure (no markdown, no code fences, just raw JSON):

{
  "vendor": "Store/company name",
  "date": "YYYY-MM-DD",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "currency": "USD",
  "lineItems": [
    {
      "description": "Item name",
      "quantity": 1,
      "unitPrice": 0.00,
      "total": 0.00,
      "category": "One of the allowed categories",
      "categoryExplanation": "Brief explanation of why this category was chosen for this specific item"
    }
  ]
}

Allowed categories: ${categoriesList}

For categoryExplanation, provide a concise reason (1-2 sentences) explaining why you chose that specific category for each item. For example: "Classified as Groceries because this is a food item purchased at a supermarket" or "Classified as Office Supplies because printer paper is a standard office consumable."

If you cannot read certain values, make your best estimate. Always return valid JSON.`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse the JSON response, stripping any markdown fences if present
    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    const extracted = JSON.parse(jsonStr);

    const receipt: Receipt = {
      id: crypto.randomUUID(),
      fileName: file.name,
      vendor: extracted.vendor || "Unknown",
      date: extracted.date || new Date().toISOString().split("T")[0],
      subtotal: extracted.subtotal || 0,
      tax: extracted.tax || 0,
      total: extracted.total || 0,
      currency: extracted.currency || "USD",
      lineItems: (extracted.lineItems || []).map(
        (item: Record<string, unknown>) => ({
          description: item.description || "Unknown item",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          total: item.total || 0,
          category: item.category || "Other",
          categoryExplanation:
            item.categoryExplanation || "No explanation available",
        })
      ),
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json(receipt);
  } catch (error) {
    console.error("Extraction error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
