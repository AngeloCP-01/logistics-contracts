import { CONTRACTS_VERSION } from "../src/index";
import type { EventEnvelope, ProblemDetails } from "../src/index";

describe("logistics-contracts package", () => {
  it("exports the version constant", () => {
    expect(CONTRACTS_VERSION).toBe("0.2.0");
  });

  it("compiles a sample EventEnvelope", () => {
    const env: EventEnvelope = {
      eventId: "00000000-0000-0000-0000-000000000000",
      eventType: "user.registered",
      eventVersion: "1.0",
      occurredAt: "2026-05-18T00:00:00Z",
      correlationId: "00000000-0000-0000-0000-000000000000",
      producer: "auth-service",
      data: { userId: "00000000-0000-0000-0000-000000000000" },
    };
    expect(env.producer).toBe("auth-service");
  });

  it("compiles a sample ProblemDetails", () => {
    const p: ProblemDetails = {
      type: "https://errors.logistics/validation",
      title: "Validation failed",
      status: 400,
    };
    expect(p.status).toBe(400);
  });
});
