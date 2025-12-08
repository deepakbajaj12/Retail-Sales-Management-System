# Retail Sales Management System

A full-stack system demonstrating search, filters, sorting, and pagination over structured retail sales data with a clean, modular architecture.

## Tech Stack
- Backend: Node.js, Express, MongoDB Atlas (Mongoose), helmet, compression, express-rate-limit
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

- ## Backend Setup
- Create `backend/.env` (see `.env.example`) with `MONGODB_URI`.
- Install deps and seed:
	- `cd backend`
	- `npm install`
	- `npm run seed`
- Run dev:
	- `npm run dev`
- Health: `GET http://localhost:4000/health`
- API: `GET http://localhost:4000/sales` or `/api/transactions`
- Frontend: `cd frontend; npm install; npm run dev`
- Configure `frontend/.env` with `VITE_API_URL=http://localhost:4000`.

## Deployment
- Backend on Render: set `MONGODB_URI`, start command `npm start`, health path `/health`.
- Frontend (Vercel/Netlify): set `VITE_API_URL` to the Render URL.

## Repository & CI
- Repo: https://github.com/deepakbajaj12/Retail-Sales-Management-System
- CI: ![CI](https://github.com/deepakbajaj12/Retail-Sales-Management-System/actions/workflows/ci.yml/badge.svg)
