# Clusta Diagnostics SERN Migration Plan

## Scope
- Migrate frontend-only Vite app to full SERN architecture.
- Keep React frontend modular and strongly typed.
- Add secure Node + Express API with Supabase persistence.
- Prepare Bubble-to-Supabase CSV migration flow.

## Chosen Decisions
- State management: Zustand.
- Payment provider: Paystack.
- Legacy users: manual admin activation (no password import).
- Currency: store prices in kobo, format as NGN (`₦`) in frontend.

## Phase Breakdown
1. Supabase schema, auth model, and RLS.
2. Express API scaffold and secure endpoints.
3. Frontend wiring to backend and Zustand migration.
4. CSV migration scripts and reconciliation checks.
5. Hardening, observability, and launch checklist.

## Immediate Implementation Milestone
- Deliver a standalone TypeScript Express server under `server/`.
- Add Supabase-ready env/config with strict validation.
- Add initial routes:
  - `GET /api/v1/health`
  - `GET /api/v1/products`
  - `GET /api/v1/products/:id`
  - `POST /api/v1/orders`
  - `POST /api/v1/payments/paystack/verify`
- Add SQL schema file for Supabase provisioning.

## Exit Criteria For This Milestone
- Backend compiles and runs locally.
- Env vars are validated on startup.
- API responds with typed JSON envelopes.
- Supabase schema SQL is ready for execution in Supabase SQL editor.
