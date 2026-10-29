# Data Model Specification

## Collections

### 1. `cases`
- `_id`: ObjectId
- `title`: String
- `scenario`: String
- `settings`: `{ difficulty: "easy" | "medium" | "hard", genre: String, length: "short" | "standard" | "extended" }`
- `status`: `"generating" | "validating" | "ready" | "failed"`
- `incident`: `{ summary: String, date?: String, time?: String, location: String }`
- `suspectIds`: ObjectId[]
- `evidenceIds`: ObjectId[]
- `solution`:
  - `culpritId`: String (references suspectId string in manifest, converted to suspect _id or string)
  - `motive`: String
  - `method`: String
  - `timeline`: `Array<{ time: String, event: String }>`
  - `explanation`: String
  - `decisiveEvidenceIds`: String[]
  - `redHerringExplanations`: String[]
- `generation`: `{ model: String, promptVersion: String, attemptCount: Number, generatedAt?: Date }`
- Timestamps: `createdAt`, `updatedAt`

### 2. `suspects`
- `_id`: ObjectId
- `caseId`: ObjectId
- `manifestId`: String (e.g. "suspect_01")
- `name`: String
- `age`: Number (optional)
- `occupation`: String
- `relationshipToIncident`: String
- `background`: String
- `alibi`: String
- `possibleMotive`: String
- Timestamps

### 3. `evidence`
- `_id`: ObjectId
- `caseId`: ObjectId
- `manifestId`: String (e.g. "evidence_01")
- `title`: String
- `type`: `"chat" | "image" | "cctv" | "witness_statement" | "document" | "forensic_report" | "timeline"`
- `description`: String
- `source`: String
- `timestamp`: String (optional)
- `relatedSuspectIds`: ObjectId[]
- `content`: Object (discriminated union by type)
- `clues`: `Array<{ id: String, description: String, importance: "minor" | "important" | "critical" }>`
- `media`: `Array<{ kind: "image" | "video" | "audio", url: String, mimeType?: String, generated: Boolean }>`
- `visibility`: `"public" | "post_verdict"`
- Timestamps

### 4. `investigations`
- `_id`: ObjectId
- `caseId`: ObjectId
- `sessionTokenHash`: String (SHA-256)
- `status`: `"active" | "completed"`
- `reviewedEvidenceIds`: ObjectId[]
- `bookmarkedEvidenceIds`: ObjectId[]
- `notes`: `Array<{ evidenceId?: ObjectId, text: String, updatedAt: Date }>`
- `accusation`:
  - `suspectId`: ObjectId
  - `reasoning`: String
  - `isCorrect`: Boolean
  - `submittedAt`: Date
- Timestamps
