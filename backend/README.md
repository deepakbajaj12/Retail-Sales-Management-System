# Backend

## Overview
Express backend exposing `/sales` API that supports full-text search, multi-select filters, sorting, and pagination over the provided sales dataset.

## Tech Stack
- Node.js, Express, cors, morgan
- MongoDB Atlas via Mongoose
- helmet, compression, express-rate-limit for production hardening

## Search Implementation Summary
- Case-insensitive search over `Customer Name` and `Phone Number`.
- Works alongside filters and sorting.

## Filter Implementation Summary
- Multi-select filters for region, gender, category, tags, payment method.
- Range filters for age and date range.
- Independent and combinable; state preserved via query params.

## Sorting Implementation Summary
- Sort by date (default, newest first), quantity, or customer name.
- Sorting preserves active search and filters.

## Pagination Implementation Summary
- Page size 10 by default; supports next/previous via `page` param.
- Returns `page`, `pageSize`, `total`, `totalPages`.

## Environment
Create `.env` (see `.env.example`):
```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

## Setup & Seeding
1. Install dependencies:
```
npm install
```
2. Seed MongoDB from CSV (`backend/data/sales.csv`):
```
npm run seed
```
3. Run dev server:
```
npm run dev
```

## Endpoints
- Health: `GET /health`
- Sales: `GET /sales` (primary)
- Transactions list: `GET /api/transactions` (same filtering/sorting behavior as `/sales`)
- Filtered stats: `GET /api/transactions/stats`
- Filter options: `GET /api/transactions/filters`
- CSV export: `GET /api/transactions/export`
- Transaction details: `GET /api/transactions/:id`
- Debug sample: `GET /debug/transactions-sample`

### Query params
- `q`: search term (name/phone)
- `regions`, `genders`, `categories`, `paymentMethods`, `tags`: comma-separated multi-select
- `ageMin`, `ageMax`: numbers
- `dateFrom`, `dateTo`: ISO date strings
- `sort`: `date|quantity|name`
- `order`: `asc|desc`
- `page`, `pageSize`: numbers

### Example
```
GET /sales?q=John&regions=North,South&categories=Electronics,Apparel&sort=date&order=desc&page=1&pageSize=10
```

### Advanced insights example
```
GET /api/transactions/stats?regions=North&dateFrom=2025-01-01&dateTo=2025-12-31
```

Returns high-level metrics plus breakdown arrays:
- `topCategories[]` with revenue and transaction count
- `revenueByRegion[]` with regional totals

## Render Deployment
- Set env var `MONGODB_URI` in the Render service.
- Start command: `npm start`
- Health check path: `/health`
- After deploy, verify `/sales` and `/api/transactions` return JSON.