# Trip Planner Pro UI Requirement Matrix

This matrix maps the current UI requirement coverage to Vitest, MSW-backed integration tests, and Playwright specs. The full browser UI suite uses deterministic mocked API responses. Real backend persistence is checked only by the env-gated backend smoke spec.

| Area | Requirement | Vitest/MSW coverage | E2E coverage | Visual/a11y coverage | Notes |
| --- | --- | --- | --- | --- | --- |
| Auth | Login and register render | `src/features/auth/components/auth-form.test.tsx` | `tests/e2e/specs/auth.spec.ts` | `visual.spec.ts`, `accessibility.spec.ts` | Role/name locators preferred. |
| Auth | Client validation and failed login recovery | `auth-schemas.test.ts`, `flows.integration.test.tsx` | `tests/e2e/specs/auth.spec.ts` | None | Submit error keeps entered values. |
| Auth | Successful login, protected route redirect, sign out | MSW auth handlers | `tests/e2e/specs/auth.spec.ts` | None | Mock token stored in localStorage. |
| Trips | List, empty state, create, edit, delete, workspace navigation context | `trip-schema.test.ts`, `trip-form.test.tsx`, `flows.integration.test.tsx` | `tests/e2e/specs/trips.spec.ts` | `visual.spec.ts`, `accessibility.spec.ts` | Workspace entry is via app navigation and topbar trip switcher, not a per-record button. |
| Trips | Offset pagination with `limit=50` | `ui.test.tsx` | `tests/e2e/specs/trips.spec.ts` | None | Request URL assertions verify params. |
| Dashboard | Itinerary grouped by date and summary metrics | `flows.integration.test.tsx` | `tests/e2e/specs/dashboard.spec.ts` | `visual.spec.ts`, `accessibility.spec.ts` | Includes itinerary, packing, budget, unpaid, overdue. |
| Dashboard | Empty itinerary dashboard state | MSW scenario support | `tests/e2e/specs/dashboard.spec.ts` | None | Trip 2 has no itinerary data. |
| Dashboard | Budget SAFE, WARNING, CRITICAL text | `domain.test.ts`, `display.test.ts` | `tests/e2e/specs/dashboard.spec.ts` | None | Trips 1, 3, and 4 cover levels. |
| Itinerary | Add, edit, delete activity | `itinerary-schema.test.ts`, `itinerary-form.test.tsx` | `tests/e2e/specs/itinerary.spec.ts` | `visual.spec.ts`, `accessibility.spec.ts` | Dialog form uses extracted component. |
| Itinerary | Inline status change | MSW handlers | `tests/e2e/specs/itinerary.spec.ts` | None | Row-scoped select. |
| Itinerary | Date, start/end time, category, status, priority, search filters | `itinerary-filters.test.ts`, `flows.integration.test.tsx` | `tests/e2e/specs/itinerary.spec.ts` | `visual.spec.ts` desktop and mobile | Request URL assertions verify `startTime/endTime`; reset control clears filters and offset. |
| Itinerary | Invalid time filters block query and show inline error | `itinerary-filters.test.ts`, `flows.integration.test.tsx` | `tests/e2e/specs/itinerary.spec.ts` | None | Time-only and reversed ranges covered. |
| Itinerary | Overdue text and visual highlight hook | `display.test.ts` | `tests/e2e/specs/itinerary.spec.ts` | `visual.spec.ts` | Uses deterministic frozen time. |
| Itinerary | Pagination preserves filters | `ui.test.tsx` | `tests/e2e/specs/itinerary.spec.ts` | None | URL and request params asserted. |
| Packing | Add, edit, delete item | `packing-schema.test.ts`, `packing-form.test.tsx` | `tests/e2e/specs/packing.spec.ts` | `visual.spec.ts`, `accessibility.spec.ts` | Mocked list mutations. |
| Packing | Mark packed/unpacked | `flows.integration.test.tsx` | `tests/e2e/specs/packing.spec.ts` | None | Row state changes after mutation. |
| Packing | Category and packed-status filters | MSW handlers | `tests/e2e/specs/packing.spec.ts` | `visual.spec.ts` mobile | Progress remains trip-level. |
| Budget | Add, edit, delete cost | `budget-schema.test.ts`, `budget-form.test.tsx` | `tests/e2e/specs/budget.spec.ts` | `visual.spec.ts`, `accessibility.spec.ts` | Mocked list mutations. |
| Budget | Paid status requires actual cost | `budget-schema.test.ts`, `budget-form.test.tsx` | `tests/e2e/specs/budget.spec.ts` | `visual.spec.ts` | Form error uses `role="alert"`. |
| Budget | Mark paid/unpaid | `flows.integration.test.tsx` | `tests/e2e/specs/budget.spec.ts` | None | Row state changes after mutation. |
| Budget | Estimated, actual, remaining, actual-vs-estimated, category totals | `domain.test.ts`, `flows.integration.test.tsx` | `tests/e2e/specs/budget.spec.ts` | `visual.spec.ts` desktop and mobile | Summary comes from mocked `/summary`; category donut uses existing category summary data. |
| Budget | Warning at 80%, critical at 100% | `domain.test.ts`, MSW data | `tests/e2e/specs/budget.spec.ts` | None | Trips 3 and 4 cover thresholds. |
| Responsive | Desktop sidebar and mobile bottom nav | `ui-store.test.ts` | `tests/e2e/specs/responsive.spec.ts` | `visual.spec.ts` | Includes no-horizontal-scroll assertion. |
| Accessibility | Dialog focus behavior, alerts, progressbar semantics | `ui.test.tsx` | `tests/e2e/specs/responsive.spec.ts` | `tests/e2e/specs/accessibility.spec.ts` | Axe scans cover login and feature pages. |
| Backend smoke | Real backend auth smoke | None | `tests/e2e/specs/backend-smoke.spec.ts` | None | Runs only when `E2E_BACKEND_URL` is set. Creates account unless seeded credentials are provided. |
| Undo/reset | Undo or reset trip behavior | Out of scope | Out of scope | Out of scope | Product gap; does not block testing infra. |

## Test Modes

- `npm run test:e2e`: mocked API requirement suite, excluding visual and backend smoke specs.
- `npm run test`: Vitest unit/component/integration suite with MSW lifecycle in `tests/vitest/setup.ts`.
- `npm run test:a11y`: Playwright + `@axe-core/playwright` checks tagged `@a11y`.
- `npm run test:visual`: Chromium-only visual regression suite with committed snapshots.
- `npm run test:smoke:backend`: real backend smoke test, skipped unless `E2E_BACKEND_URL` is configured.
- `npm run test:ci`: strict PR aggregate for lint, typecheck, Vitest, mocked E2E, a11y, and visual.

## Locator Policy

Use accessible role/name locators first. Use `data-testid` only for repeated row/card containers or visual snapshot anchors when role/name locators are ambiguous.
