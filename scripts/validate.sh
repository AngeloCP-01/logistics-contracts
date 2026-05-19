#!/usr/bin/env bash
# Validate all contract files: OpenAPI specs, AsyncAPI, and JSON Schemas.
# Exits non-zero on the first failure.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Validating OpenAPI specs..."
npx redocly lint openapi/auth-service.yaml openapi/user-service.yaml

echo "==> Validating AsyncAPI spec..."
npx asyncapi validate events/asyncapi.yaml

echo "==> Validating JSON Schema files (parse only)..."
for schema in schemas/*.json; do
  node -e "JSON.parse(require('fs').readFileSync('$schema','utf8'))" \
    && echo "  ok: $schema"
done

echo "All contracts valid."
