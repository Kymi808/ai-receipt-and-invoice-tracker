# AI Receipt & Invoice Tracker

Upload photos or PDFs of receipts and invoices. Uses Claude AI to extract line items, categorize spending, and explain categorization decisions. Export everything to CSV.

## Features

- **Upload receipts/invoices** — drag & drop or click to upload images (JPEG, PNG) or PDFs
- **AI-powered extraction** — automatically extracts vendor, date, line items, quantities, prices, tax, and totals
- **Smart categorization** — assigns each line item to a spending category (Food & Dining, Office Supplies, Transportation, etc.)
- **"Why this category?" view** — see AI explanations for why each item was categorized the way it was
- **Spend summary** — visual breakdown of spending by category with percentages
- **CSV export** — export all receipts and line items to a CSV file for accounting/bookkeeping

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# Install dependencies
npm install

# Set up your API key
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## How It Works

1. Upload a receipt or invoice (image or PDF)
2. Claude AI analyzes the document and extracts all line items with prices
3. Each item is automatically categorized with an explanation
4. View the spend summary to see where your money goes
5. Click "Why this category?" on any receipt to see the AI's reasoning
6. Export all data to CSV for your records

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Claude API](https://docs.anthropic.com/) — AI-powered document analysis
- TypeScript — type safety

## Spending Categories

Food & Dining, Groceries, Transportation, Utilities, Office Supplies, Software & Subscriptions, Travel & Lodging, Entertainment, Healthcare & Medical, Clothing & Apparel, Home & Maintenance, Professional Services, Education & Training, Insurance, Other
