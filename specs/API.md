# API Specification

Base URL: `/api/v1`

## Endpoints

### 1. Health
- `GET /health` -> `{ status: "ok", timestamp: string, version: string }`

### 2. Case Generation & Query
- `POST /cases`
  - Body: `{ scenario: string, settings?: { difficulty?: "easy"|"medium"|"hard", genre?: string, length?: "short"|"standard"|"extended" } }`
  - Response: `{ caseId: string, status: "ready", title: string, investigationId: string, sessionToken: string }`
- `GET /cases/:caseId`
  - Public case details: title, incident summary, date, time, location, settings. (Solution omitted!)
- `GET /cases/:caseId/suspects`
  - List of suspects (name, age, occupation, relationshipToIncident, background, alibi, possibleMotive).
- `GET /cases/:caseId/evidence`
  - Query params: `type`, `suspectId`
  - List of evidence metadata (title, type, description, source, timestamp, relatedSuspectIds, clues).
- `GET /cases/:caseId/evidence/:evidenceId`
  - Full evidence artifact with type-specific content and media.

### 3. Investigation & Progress
Headers: `x-session-token: <sessionToken>`
- `GET /investigations/:investigationId`
  - Returns current investigation state (reviewedEvidenceIds, bookmarkedEvidenceIds, notes, accusationStatus).
- `PATCH /investigations/:investigationId/progress`
  - Body: `{ reviewedEvidenceIds?: string[], bookmarkedEvidenceIds?: string[] }`
- `PUT /investigations/:investigationId/notes`
  - Body: `{ notes: Array<{ evidenceId?: string, text: string }> }`

### 4. Accusation & Verdict
- `POST /investigations/:investigationId/accusation`
  - Body: `{ suspectId: string, reasoning?: string }`
  - Response:
    ```json
    {
      "status": "completed",
      "isCorrect": boolean,
      "selectedSuspect": { "id": string, "name": string },
      "solution": {
        "culprit": { "id": string, "name": string },
        "motive": string,
        "method": string,
        "explanation": string,
        "decisiveEvidenceIds": string[],
        "redHerringExplanations": string[]
      }
    }
    ```
