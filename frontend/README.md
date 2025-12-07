# Frontend

## Overview
React (Vite) SPA implementing structured UI with search bar, filter panel, sorting dropdown, transactions table, and pagination controls.

## Tech Stack
- React, Vite

## Search Implementation Summary
- Debounced input updates query state; backend case-insensitive search over name/phone.

## Filter Implementation Summary
- Multi-select inputs (comma-separated) for region, gender, category, tags, payment method.
- Numeric ranges for age and date range via inputs.

## Sorting Implementation Summary
- Dropdowns for sort field and order; default newest-first by date.

## Pagination Implementation Summary
- Page size 10; next/previous buttons retain state.

## Setup Instructions
1. Install dependencies:
```
npm install
```
2. Configure backend URL via `.env`:
```
VITE_API_URL=http://localhost:4000
```
3. Run dev server:
```
npm run dev
```
4. Open `http://localhost:5173` in browser.