# Agent Guide

## Project Overview

SignalBlindspot is a PM portfolio MVP that evaluates whether roadmap evidence is representative. It is not a generic feedback tracker.

## Commands

- Install: `npm.cmd install`
- Dev: `npm.cmd run dev`
- Prisma generate: `npm.cmd run db:generate`
- Migration: `npm.cmd run db:migrate`
- Seed: `npm.cmd run db:seed`
- Lint: `npm.cmd run lint`
- Typecheck: `npm.cmd run typecheck`
- Unit/integration tests: `npm.cmd run test`
- E2E: `npm.cmd run test:e2e`
- Build: `npm.cmd run build`

## Architecture Notes

- Domain types live in `lib/types.ts`.
- Scoring, blind-spot detection, recommendations, reports, and workflow validation live in `lib/scoring.ts`.
- CSV validation lives in `lib/csv.ts`.
- Deterministic synthetic data lives in `lib/demo-data.ts`.
- Prisma models and seed data live in `prisma/`.
- App routes live in `app/`.

## Adding Scoring Factors

Add the factor to `ScoringWeights`, `ScoreBreakdown`, `defaultScoringWeights`, `validateScoringWeights`, `calculateCoverageScore`, docs, and tests.

## Adding Blind-Spot Rules

Add a focused rule in `detectBlindSpots`, include a clear explanation and recommended action, and add a test covering severity and output.

## Guardrails

Use synthetic data only. Do not let revenue weighting override representation quality. Keep business logic testable outside UI components.
