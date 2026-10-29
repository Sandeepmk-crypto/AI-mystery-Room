import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { connectDB, disconnectDB } from "../src/config/db.js";

describe("AI Mystery Room — Comprehensive API Test Suite", () => {
  beforeAll(async () => {
    // Connect to test database (in-memory MongoDB)
    await connectDB();
  }, 60000);

  afterAll(async () => {
    await disconnectDB();
  });

  describe("1. Health Endpoint", () => {
    it("should return 200 OK with health status", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("AI Mystery Room API");
    });
  });

  describe("2. Case Generation & Validation", () => {
    it("should reject scenario input with fewer than 10 characters", async () => {
      const res = await request(app)
        .post("/api/v1/cases")
        .send({ scenario: "Too short" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should create a valid playable case with session token", async () => {
      const res = await request(app)
        .post("/api/v1/cases")
        .send({
          scenario: "A rare emerald necklace vanished from a high-security vault during a charity ball.",
          settings: {
            difficulty: "medium",
            genre: "Heist Mystery",
            length: "standard",
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.caseId).toBeDefined();
      expect(res.body.status).toBe("ready");
      expect(res.body.title).toBeDefined();
      expect(res.body.investigationId).toBeDefined();
      expect(res.body.sessionToken).toBeDefined();
      expect(typeof res.body.sessionToken).toBe("string");
      expect(res.body.sessionToken.length).toBe(64); // 32 bytes hex
    });
  });

  describe("3. Hidden Solution Protection (Security Invariant)", () => {
    it("must NEVER expose the solution or culprit in public case API responses", async () => {
      // 1. Create a case
      const createRes = await request(app)
        .post("/api/v1/cases")
        .send({
          scenario: "The priceless sapphire vanished from the locked study.",
        });
      const caseId = createRes.body.caseId;

      // 2. Query public case
      const caseRes = await request(app).get(`/api/v1/cases/${caseId}`);
      expect(caseRes.status).toBe(200);

      // Verify that hidden solution fields are ABSENT
      expect(caseRes.body.solution).toBeUndefined();
      expect(caseRes.body.culpritId).toBeUndefined();
      expect(caseRes.body.decisiveEvidenceIds).toBeUndefined();
      expect(caseRes.body.explanation).toBeUndefined();

      // Verify suspects are populated without solution indicators
      expect(caseRes.body.suspects.length).toBeGreaterThanOrEqual(3);
      for (const suspect of caseRes.body.suspects) {
        expect(suspect.isCulprit).toBeUndefined();
      }

      // 3. Query suspects endpoint
      const suspectsRes = await request(app).get(`/api/v1/cases/${caseId}/suspects`);
      expect(suspectsRes.status).toBe(200);
      for (const suspect of suspectsRes.body) {
        expect(suspect.isCulprit).toBeUndefined();
      }

      // 4. Query evidence endpoint
      const evidenceRes = await request(app).get(`/api/v1/cases/${caseId}/evidence`);
      expect(evidenceRes.status).toBe(200);
      expect(evidenceRes.body.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("4. Investigation Session Auth & Progress", () => {
    it("should reject investigation requests without a session token", async () => {
      const createRes = await request(app)
        .post("/api/v1/cases")
        .send({ scenario: "A tech CEO is blackmailed at a luxury hotel." });
      const investigationId = createRes.body.investigationId;

      const res = await request(app).get(`/api/v1/investigations/${investigationId}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("INVALID_SESSION");
    });

    it("should reject investigation requests with an invalid session token", async () => {
      const createRes = await request(app)
        .post("/api/v1/cases")
        .send({ scenario: "A tech CEO is blackmailed at a luxury hotel." });
      const investigationId = createRes.body.investigationId;

      const res = await request(app)
        .get(`/api/v1/investigations/${investigationId}`)
        .set("x-session-token", "invalid-token-12345");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("INVALID_SESSION");
    });

    it("should allow investigation progress tracking and note saving with valid token", async () => {
      const createRes = await request(app)
        .post("/api/v1/cases")
        .send({ scenario: "A tech CEO is blackmailed at a luxury hotel." });
      const { caseId, investigationId, sessionToken } = createRes.body;

      // Fetch evidence list
      const evidenceListRes = await request(app).get(`/api/v1/cases/${caseId}/evidence`);
      const sampleEvidenceId = evidenceListRes.body[0].id;

      // Update progress (mark reviewed and bookmarked)
      const patchRes = await request(app)
        .patch(`/api/v1/investigations/${investigationId}/progress`)
        .set("x-session-token", sessionToken)
        .send({
          reviewedEvidenceIds: [sampleEvidenceId],
          bookmarkedEvidenceIds: [sampleEvidenceId],
        });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.reviewedEvidenceIds).toContain(sampleEvidenceId);
      expect(patchRes.body.bookmarkedEvidenceIds).toContain(sampleEvidenceId);

      // Save detective notes
      const notesRes = await request(app)
        .put(`/api/v1/investigations/${investigationId}/notes`)
        .set("x-session-token", sessionToken)
        .send({
          notes: [
            {
              evidenceId: sampleEvidenceId,
              text: "The timestamp directly conflicts with the suspect's stated alibi.",
            },
          ],
        });

      expect(notesRes.status).toBe(200);
      expect(notesRes.body.notes.length).toBe(1);
      expect(notesRes.body.notes[0].text).toContain("conflicts with the suspect's stated alibi");
    });
  });

  describe("5. Accusation & Single-Attempt Verdict Evaluation", () => {
    it("should evaluate an accusation and disallow repeated submissions", async () => {
      // 1. Create a fresh case
      const createRes = await request(app)
        .post("/api/v1/cases")
        .send({
          scenario: "The poisoned chalice at the royal banquet.",
        });
      const { caseId, investigationId, sessionToken } = createRes.body;

      // 2. Fetch suspects
      const suspectsRes = await request(app).get(`/api/v1/cases/${caseId}/suspects`);
      expect(suspectsRes.body.length).toBeGreaterThan(0);
      const accusedSuspect = suspectsRes.body[0];

      // 3. Submit accusation
      const accusationRes = await request(app)
        .post(`/api/v1/investigations/${investigationId}/accusation`)
        .set("x-session-token", sessionToken)
        .send({
          suspectId: accusedSuspect.id,
          reasoning: "The forensic residue connects this suspect directly to the scene.",
        });

      expect(accusationRes.status).toBe(200);
      expect(accusationRes.body.status).toBe("completed");
      expect(typeof accusationRes.body.isCorrect).toBe("boolean");
      expect(accusationRes.body.selectedSuspect.id).toBe(accusedSuspect.id);
      expect(accusationRes.body.solution.culprit).toBeDefined();
      expect(accusationRes.body.solution.explanation).toBeDefined();
      expect(accusationRes.body.solution.decisiveEvidenceIds.length).toBeGreaterThan(0);

      // 4. Try submitting a second accusation on the same case -> must be rejected!
      const duplicateRes = await request(app)
        .post(`/api/v1/investigations/${investigationId}/accusation`)
        .set("x-session-token", sessionToken)
        .send({
          suspectId: accusedSuspect.id,
        });

      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.error.code).toBe("ALREADY_COMPLETED");
    });
  });
});
