# @<gh-org>/logistics-contracts

TypeScript types and JSON Schemas for the AI Logistics Platform.

## Install

```bash
npm install @<gh-org>/logistics-contracts
```

(Requires npm to be authenticated against GitHub Packages — see the platform README.)

## Use

```ts
import { EventEnvelope, ProblemDetails, CONTRACTS_VERSION } from "@<gh-org>/logistics-contracts";

// JSON Schemas ship alongside the types for runtime validation:
import envelopeSchema from "@<gh-org>/logistics-contracts/schemas/event-envelope.json";
```
