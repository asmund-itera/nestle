## Description

A Wordle-style game implemented with NestJS on the backend and React on the frontend.
The frontend now runs on Vite and uses TanStack Router with file-based routes and TanStack Query for data fetching.
The backend uses Prisma with PostgreSQL.

## Project structure

- `backend/`: NestJS API + Prisma/PostgreSQL access
- `frontend/`: Vite + React + TanStack Router + TanStack Query app

## Install dependencies

Install dependencies in each app:

```bash
$ cd backend && npm install
$ cd ../frontend && npm install
```

## Run in development

Run each app in its own terminal:

```bash
# backend
$ cd backend
$ npm run start:dev

# frontend
$ cd frontend
$ npm run dev
```

Default local URLs:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001`

## Build

From repo root:

```bash
$ npm run build
```

Or per app:

```bash
$ cd backend && npm run build
$ cd ../frontend && npm run build
```

## Tests

From repo root:

```bash
# runs backend + frontend unit tests (no e2e)
$ npm run test

# runs backend e2e tests
$ npm run test:e2e
```

Per app:

```bash
# backend unit tests
$ cd backend && npm run test

# backend e2e tests
$ cd backend && npm run test:e2e

# backend coverage
$ cd backend && npm run test:cov

# frontend unit/component tests (Vitest)
$ cd frontend && npm run test

# frontend watch mode
$ cd frontend && npm run test:watch
```

## Notes

- The frontend proxies `/api/*` requests to the backend during development via Vite.
- Session handling is cookie-based (`nestle_session`), not URL-based.
- Frontend routes are `/` and `/:date`.
- The frontend uses TanStack Router file-based routes under `frontend/src/routes`.
- The backend Prisma datasource is PostgreSQL.
