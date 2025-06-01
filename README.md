# ReWind Marketplace

A full-featured marketplace built with Next.js, Prisma, NextAuth, Stripe, and SendGrid.

## Features
- User authentication (NextAuth with Google)
- Sellers can create shops and list items for sale
- Buyers can browse shops and purchase items
- 8% commission on each sale via Stripe Connect
- Order tracking, status updates, digital downloads, and receipts
- Email notifications for both buyers and sellers using SendGrid
- Seller analytics dashboard with Recharts

## Setup

1. Clone this repository.
2. Copy `.env.example` to `.env` and fill in the environment variables.
3. Install dependencies:
   ```
   npm install
   ```
4. Run Prisma migration:
   ```
   npx prisma migrate dev --name init
   ```
5. Start the development server:
   ```
   npm run dev
   ```
6. Configure Stripe webhooks to point to `http://localhost:3000/api/webhook`.

