# trip-planner-pro-frontend

Vite + React + TypeScript frontend for Trip Planner Pro.

## Local Commands

- `npm run dev`: start the Vite development server.
- `npm run lint`: run ESLint.
- `npm run typecheck`: typecheck the application build graph.
- `npm run typecheck:test`: typecheck Vitest and Playwright test code.
- `npm run test`: run Vitest unit, component, and integration tests.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run test:e2e`: run mocked Playwright functional E2E tests.
- `npm run test:a11y`: run Playwright accessibility checks with `@axe-core/playwright`.
- `npm run test:visual`: run Playwright visual regression tests.
- `npm run test:smoke:backend`: run env-gated real backend smoke tests.
- `npm run test:ci`: run the strict PR aggregate locally.
- `npm run build`: typecheck and build the production bundle.

## Testing Notes

Vitest uses React Testing Library, per-test TanStack Query clients, MSW handlers, and deterministic factories under `tests/`. Playwright E2E defaults to mocked API data in PR checks; real backend smoke requires `E2E_BACKEND_URL`.
