# logistics-contracts — Repo Guide

> Authoritative inter-service contracts for the AI Logistics Platform: HTTP (OpenAPI), async events (AsyncAPI), shared JSON Schemas.

**Phase:** 0 (foundation) — scaffold only; implementation per [`../docs/superpowers/plans/2026-05-18-phase-0-foundation.md`](../docs/superpowers/plans/2026-05-18-phase-0-foundation.md) Section A.
**Status:** ⬜ Not started

## What this repo is

The single source of truth that every other repo depends on for cross-service shapes. There are NO runtime services here — only specs, schemas, and the published packages that wrap them.

## What ships from this repo

| Artifact | Where | Consumed by |
|---|---|---|
| OpenAPI 3.1 specs | `openapi/<service>.yaml` | Each service's CI runs contract validation against its spec |
| AsyncAPI 3.0 spec | `events/asyncapi.yaml` | Event producers + consumers reference this for routing keys + payload schemas |
| Shared JSON Schemas | `schemas/*.json` | `event-envelope.json`, `problem-details.json` |
| Node package | `packages/node/` published as `@angelocp-01/logistics-contracts` to GitHub Packages | All Node services |
| Python wheel | `packages/python/` published as `logistics-contracts` (skeleton in v0.1.0) | AI service (later) |

## Locked decisions

- **Versioning**: SemVer. Tags `vMAJOR.MINOR.PATCH`. Breaking changes bump major.
- **Event envelope**: shared shape (`eventId`, `eventType`, `eventVersion`, `occurredAt`, `correlationId`, `producer`, `data`). See `schemas/event-envelope.json`.
- **Event versioning**: additive changes bump `eventVersion` minor; breaking changes mint a new event type (`order.created.v2`).
- **Error format**: every service returns RFC 7807 Problem Details with `application/problem+json`.
- **Type generation**: Node TS types are generated from JSON Schemas via `json-schema-to-typescript`. Generated files have a "DO NOT EDIT" banner.

## Current event catalog (v0.2.0)

| Routing key                         | Producer     | Phase added |
| ----------------------------------- | ------------ | ----------- |
| `user.registered`                   | auth-service | 0           |
| `user.email_verification_requested` | auth-service | 1           |
| `user.email_verified`               | auth-service | 1           |
| `user.password_reset_requested`     | auth-service | 1           |
| `user.password_changed`             | auth-service | 1           |
| `user.role_changed`                 | auth-service | 1           |

## Layout (after Phase 0 ships)

```
events/asyncapi.yaml            # AsyncAPI 3.0 spec for all events
openapi/                        # OpenAPI 3.1, one per service
  auth-service.yaml
  user-service.yaml
schemas/                        # JSON Schemas (the source of truth)
  event-envelope.json
  problem-details.json
packages/
  node/                         # @angelocp-01/logistics-contracts (npm)
    src/index.ts                # public exports
    src/envelope.ts             # GENERATED — do not edit
    src/problem.ts              # GENERATED — do not edit
    tests/
  python/                       # logistics-contracts (Python wheel)
scripts/
  validate.sh                   # OpenAPI + AsyncAPI + JSON Schema validation
  generate-node-types.sh        # regenerates packages/node/src/{envelope,problem}.ts
.github/workflows/publish.yml   # tag v* → validate → publish npm + build wheel
```

## Common commands (once Phase 0 ships)

```bash
npm install                 # root tooling
npm run validate            # lint OpenAPI + AsyncAPI + JSON Schemas
npm run generate:node       # regenerate TS types from JSON Schemas

cd packages/node
npm install && npm run build && npm test
```

## Conventions

- All routing keys are lowercase, dotted, snake_case-within-segment if needed: `order.created`, `dispatch.driver.assigned`.
- All schemas use `"$schema": "https://json-schema.org/draft/2020-12/schema"`.
- All OpenAPI paths start with `/v1/` (the gateway strips the `/v1` prefix before routing). The OpenAPI specs themselves declare the gateway-relative paths without the `/v1` prefix (server URL handles it).
- Breaking changes require both a spec PR AND a discussion of migration order across consumers BEFORE merging.

## Don't do

- Don't edit generated files (`packages/node/src/envelope.ts`, `packages/node/src/problem.ts`). Edit the source JSON Schema in `schemas/` and re-run `npm run generate:node`.
- Don't add a route to a service's OpenAPI spec without also implementing it in that service (and vice versa). Contracts and code march together.
- Don't put service-specific business types here. This repo is for **inter-service** contracts only.
- Don't publish the root `package.json`. Only `packages/node/` is published.

## Pointers

- Spec: [`../docs/superpowers/specs/2026-05-18-platform-decomposition-design.md`](../docs/superpowers/specs/2026-05-18-platform-decomposition-design.md) §4 (contracts)
- Plan: [`../docs/superpowers/plans/2026-05-18-phase-0-foundation.md`](../docs/superpowers/plans/2026-05-18-phase-0-foundation.md) Section A
- Tracker: [`../docs/superpowers/tracker.md`](../docs/superpowers/tracker.md)
