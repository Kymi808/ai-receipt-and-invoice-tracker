export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
  categoryExplanation: string;
}

export interface Receipt {
  id: string;
  fileName: string;
  vendor: string;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  lineItems: LineItem[];
  uploadedAt: string;
}

export const CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transportation",
  "Utilities",
  "Office Supplies",
  "Software & Subscriptions",
  "Travel & Lodging",
  "Entertainment",
  "Healthcare & Medical",
  "Clothing & Apparel",
  "Home & Maintenance",
  "Professional Services",
  "Education & Training",
  "Insurance",
  "Other",
] as const;
