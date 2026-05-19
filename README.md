# logistics-contracts

Inter-service contracts for the AI Logistics Platform. Authoritative for HTTP (OpenAPI), async events (AsyncAPI), and shared schemas (JSON Schema).

## Layout

| Path | Purpose |
|---|---|
| `openapi/` | OpenAPI 3.1 specs, one per public service |
| `events/asyncapi.yaml` | AsyncAPI 3.0 spec for the `logistics.events` topic exchange |
| `schemas/` | Shared JSON Schemas referenced by both |
| `packages/node/` | Published as `@<gh-org>/logistics-contracts` on GitHub Packages |
| `packages/python/` | Published as `logistics-contracts` (Python wheel) |
| `scripts/validate.sh` | Lint + validate all contract files |
| `scripts/generate-node-types.sh` | Regenerate TS types from JSON Schemas |

## Versioning

Semantic Versioning. Tags `vMAJOR.MINOR.PATCH`. Breaking changes bump major. Adding a new endpoint or event field bumps minor. Bug fixes bump patch.

## Local development

```bash
npm install                  # installs validation + codegen tooling
npm run validate             # lint OpenAPI + AsyncAPI + parse JSON Schemas
npm run generate:node        # regenerate packages/node/src/{envelope,problem}.ts

# Node package
cd packages/node
npm install && npm run build && npm test
```

## Publishing

Tag and push:
```bash
git tag v0.1.0
git push origin v0.1.0
```
The `publish.yml` workflow validates, builds, runs tests, and publishes to GitHub Packages.
