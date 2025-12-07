# Backend

## Overview
Express backend exposing `/sales` API that supports full-text search, multi-select filters, sorting, and pagination over the provided sales dataset.

## Tech Stack
- Node.js, Express, cors, morgan
- csv-parse for CSV ingestion

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

## Setup Instructions
1. Place dataset at `backend/data/sales.csv` or set `DATA_URL` env.
2. Install dependencies:
```
npm install
```
3. Run dev server:
```
npm run dev
```
4. Health check: `GET http://localhost:4000/health`
5. API: `GET http://localhost:4000/sales?q=John&regions=North&sort=date&order=desc&page=1&pageSize=10`