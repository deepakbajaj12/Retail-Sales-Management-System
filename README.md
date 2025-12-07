# Retail Sales Management System

A full-stack system demonstrating search, filters, sorting, and pagination over structured retail sales data with a clean, modular architecture.

## Tech Stack
- Backend: Node.js, Express, csv-parse
- Frontend: React (Vite)

## Search Implementation Summary
- Case-insensitive full-text search on `Customer Name` and `Phone Number`.
- Works alongside all filters and sorting.

## Filter Implementation Summary
- Multi-select filters: `Customer Region`, `Gender`, `Product Category`, `Tags`, `Payment Method`.
- Range filters: `Age` and `Date`.
- Filters are independent and composable; state kept in query params.

## Sorting Implementation Summary
- Sort by `Date` (newest first), `Quantity`, or `Customer Name (A–Z)`.
- Sorting preserves search and filters.

## Pagination Implementation Summary
- 10 items per page; next/previous navigation with retained state.

## Setup Instructions
- Backend: `cd backend; npm install; npm run dev`
- Frontend: `cd frontend; npm install; npm run dev`
- Configure `frontend/.env` with `VITE_API_URL=http://localhost:4000`.

## Repository & CI
- Repo: https://github.com/deepakbajaj12/Retail-Sales-Management-System
- CI: ![CI](https://github.com/deepakbajaj12/Retail-Sales-Management-System/actions/workflows/ci.yml/badge.svg)
