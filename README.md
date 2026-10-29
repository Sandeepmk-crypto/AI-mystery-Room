# 🕵️ AI Mystery Room

**Interactive AI-Powered Fictional Mystery Investigation Game**  
*MERN Stack (MongoDB, Express, React, Node.js + TypeScript) & Google Gemini API*

---

## 📖 Executive Summary & Core Principle

AI Mystery Room is a detective game where users provide a short story, scenario, or crime premise, and the system generates a complete, internally consistent, solvable mystery investigation.

### 🔒 The Solvability Invariant
> **Every mystery is 100% solvable using the evidence provided, and the intended culprit and facts needed to establish guilt are fixed BEFORE the investigation begins.**
> The AI never alters the culprit, motives, or evidence after the case has started. Pre-verdict API payloads strictly withhold the culprit and hidden solution so it cannot be inspected or leaked.

---

## 🌟 Key Features

1. **AI Case Generator:** Powered by Google Gemini (with an automatic deterministic mock generator fallback for offline development & testing).
2. **Deterministic Single Culprit:** Exactly one predetermined culprit with motives, method, timeline, and decisive clues.
3. **Multi-Format Evidence System:**
   - **WhatsApp/Chat Forensics:** Encrypted messages, timestamps, participant tags, and highlighted key clues.
   - **Auxiliary CCTV Logs:** Security DVR framing, scanlines, camera switch, still-frame reconstructions, and motion trigger transcripts.
   - **Crime Scene & Evidence Photos:** High-resolution photographs with interactive forensic annotations and UV tags.
   - **Witness Interrogation Statements:** Police interview transcripts with demeanor notes.
   - **Classified Documents & Registers:** Official letterheads, equipment checkouts, and signatures.
   - **Forensic Toxicology Reports:** Laboratory chemical, ballistic, and fingerprint analysis.
   - **Chronological Incident Timeline:** Verified event markers of the night of the incident.
4. **Detective Workspace:**
   - Suspect Lineup with profiles, alibis, and relationships.
   - Evidence Filter Pills (Chats, CCTV, Forensics, Documents, Photos, Witness).
   - Detective Notebook with real-time field notes, bookmark tray, and reviewed progress tracking.
5. **Final Accusation & Revelation:**
   - Single-attempt accusation protocol with irreversible submission.
   - Server-side deterministic evaluation against stored culprit ID (no AI judgment hallucination).
   - Post-verdict breakdown explaining the hidden truth, decisive clues, and debunked red herrings.
6. **Zero-Friction Database:** Automatically connects to local MongoDB or initializes an isolated in-memory MongoDB replica if no local daemon is running.

---

## 🛠️ Tech Stack

- **Frontend (`apps/web`):** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router v6, Axios.
- **Backend (`apps/api`):** Node.js, Express, TypeScript, Mongoose ODM, Zod schema validation, Helmet, CORS, Morgan.
- **Shared (`packages/shared`):** Canonical TypeScript contracts and Zod runtime validation schemas.
- **AI Provider:** Google Gemini API (`@google/generative-ai`) with structured JSON schema mode and deterministic mock generator fallback.
- **Testing:** Vitest, Supertest, In-Memory MongoDB.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v24+ supported)
- **npm:** v9.0.0 or higher

### 2. Setup Environment
Clone the repository and copy `.env.example`:
```bash
cp .env.example .env
```
Key variables in `.env`:
```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
CLIENT_ORIGIN=http://localhost:5173

# Optional: Add your Google Gemini API key to generate custom AI cases
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Set to true to force deterministic mock cases (default when GEMINI_API_KEY is empty)
USE_MOCK_AI=false
```

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Run Development Servers
Start both Backend API and Frontend simultaneously:
```bash
npm run dev
```
Or run separately:
- **API Server:** `npm run dev:api` (Runs at http://localhost:5000)
- **Web App:** `npm run dev:web` (Runs at http://localhost:5173)

---

## 🧪 Testing

Run the comprehensive API test suite:
```bash
npm test
```
The test suite verifies:
- Health check endpoints
- Scenario length & payload validation
- Case creation with 32-byte cryptographic session tokens
- **Hidden Solution Security Invariant:** Asserts that pre-verdict case & evidence endpoints never expose `solution`, `culpritId`, or `decisiveEvidenceIds`.
- Investigation session authentication & progress persistence
- Single-attempt accusation protocol & 409 duplicate accusation rejection

---

## 📦 Building for Production

Build all packages and applications:
```bash
npm run build
```

---

## 📁 Repository Structure

```text
ai-mystery-room/
├── apps/
│   ├── api/                     # Express.js REST API
│   │   ├── src/
│   │   │   ├── config/          # Env & DB connection with memory-server fallback
│   │   │   ├── controllers/     # Case, Evidence, Investigation controllers
│   │   │   ├── middleware/      # Auth, Error, Zod validation
│   │   │   ├── models/          # Case, Suspect, Evidence, Investigation models
│   │   │   ├── routes/          # API v1 routes
│   │   │   ├── services/
│   │   │   │   ├── ai/          # Gemini service & Mock case generator
│   │   │   │   ├── cases/       # Case persistence & public projection
│   │   │   │   ├── investigations/ # Session hashing & progress
│   │   │   │   └── verdict/     # Deterministic verdict evaluation
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   └── tests/               # Vitest + Supertest integration tests
│   └── web/                     # React + Vite + Tailwind Frontend
│       ├── src/
│       │   ├── components/      # Header, Footer, Loaders, Error states
│       │   ├── features/
│       │   │   ├── home/        # Landing page & preset showcases
│       │   │   ├── case-creation/ # Prompt builder & animated generator
│       │   │   ├── investigation/ # Case briefing & 3-column workspace
│       │   │   ├── evidence-viewers/ # Chat, CCTV, Forensic, Image viewers
│       │   │   └── accusation/  # Accusation modal & Verdict reveal page
│       │   ├── lib/             # API client & session storage
│       │   └── styles/          # Tailwind & dark detective theme
├── packages/
│   └── shared/                  # Shared TypeScript types & Zod schemas
└── specs/                       # Source of Truth specifications
    ├── SPEC.md
    ├── ARCHITECTURE.md
    ├── API.md
    ├── DATA_MODEL.md
    ├── AI_GENERATION.md
    ├── UI_UX.md
    └── ACCEPTANCE_TESTS.md
```

---

## ⚖️ License
MIT License. Built for interactive mystery entertainment. All generated cases, characters, and artifacts are strictly fictional.
