# Architecture Specification

## 1. System Topology

```text
React 18+ Client (Vite + Tailwind CSS + TypeScript)
      |
      | HTTP REST API (JSON) with Session Token Headers
      v
Express API Gateway (TypeScript + Middleware)
      |
      +---> Rate Limiting & Security (Helmet, CORS, Mongo Sanitization)
      +---> Request Validation Layer (Zod schemas from packages/shared)
      |
      +---> Case Controller & Services
      |       |
      |       +---> AI Case Generator (Google Gemini API / Mock Provider)
      |       +---> Structural & Narrative Consistency Validator
      |       +---> Case Finalizer & Database Persistence
      |
      +---> Evidence & Suspect Services (Public Projection Only)
      +---> Investigation & Progress Service (Session verification, Notes, Bookmarks)
      +---> Accusation & Verdict Service (Deterministic server-side judgment)
      |
      v
MongoDB Persistence Layer (Mongoose ODM / Embedded or In-Memory Replica)
```

## 2. Security Boundaries & Invariants
1. **Hidden Solution Protection:** Solution payload (`culpritId`, `motive`, `method`, `explanation`, `decisiveEvidenceIds`) is stripped from all public case/suspect/evidence endpoints prior to verdict submission.
2. **Deterministic Accusation:** Verdict is evaluated purely by string ID comparison on the server. No AI evaluation is performed at accusation time to prevent hallucinated verdicts.
3. **Session Authentication:** Anonymous detectives receive a cryptographically secure 32-byte hex token upon case creation. Only the SHA-256 hash is persisted in the database.
4. **Input Sanitization:** User scenarios are strictly bounded (min 10 chars, max 2000 chars) and checked against prompt injection rules.
