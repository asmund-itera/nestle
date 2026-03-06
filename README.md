## Description

A wordle game implemented in NestJS, React (NextJS) and tailwind, with a sqlite database.

## Project structure

- `backend/`: NestJS API + SQLite access
- `frontend/`: Next.js app

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

- The frontend expects API requests through `/api/*` rewrites to the backend.
- Session handling is cookie-based (`nestle_session`), not URL-based.
- SQLite database file defaults to `backend/data.db` unless `SQLITE_PATH` is set.
