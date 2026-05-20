# @angelocp-01/logistics-contracts

TypeScript types and JSON Schemas for the AI Logistics Platform.

## Install

```bash
npm install @angelocp-01/logistics-contracts
```

(Requires npm to be authenticated against GitHub Packages — see the platform README.)

## Use

```ts
import { EventEnvelope, ProblemDetails, CONTRACTS_VERSION } from "@angelocp-01/logistics-contracts";

// JSON Schemas ship alongside the types for runtime validation:
import envelopeSchema from "@angelocp-01/logistics-contracts/schemas/event-envelope.json";
```
