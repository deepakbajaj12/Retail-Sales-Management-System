# Architecture

## Backend Architecture
- Express server with layered modules: routes -> controllers -> services -> utils.
- Data loader parses CSV from local file or Google Drive URL.
- Service applies search (case-insensitive), multi-select filters, range filters, date range, sorting, and pagination.
- Validation utility ensures query correctness and handles edge cases.

## Frontend Architecture
- React (Vite) SPA with predictable state via `useQueryState` hook.
- Components: SearchBar, FiltersPanel, SortingDropdown, TransactionsTable, PaginationControls.
- Service layer `api.js` constructs query string and calls backend.
- Styles follow minimal structured layout per assignment.

## Data Flow
- User interacts with UI; state updates trigger fetch to `/sales`.
- Backend validates query, loads/normalizes data, filters/sorts pages results, returns JSON.
- Frontend displays table with pagination; search/filters/sort persist across interactions.

## Folder Structure
- backend/src/controllers, services, utils, routes, models(optional).
- frontend/src/components, hooks, services, styles, utils.
- docs/architecture.md, README.md.

## Module Responsibilities
- routes: define endpoints.
- controllers: validate, orchestrate, respond.
- services: core business logic for querying.
- utils: data loading, normalization, validation helpers.
- components/hooks/services: UI rendering and state + API calls.
