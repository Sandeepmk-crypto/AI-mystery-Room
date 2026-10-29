# AI Mystery Room — Product & Technical Specification

**Document type:** Source of Truth for Spec-Driven Development  
**Project name:** AI Mystery Room  
**Document version:** 1.0.0  
**Status:** Initial implementation specification  
**Architecture:** MERN Stack (MongoDB, Express, React, Node.js + TypeScript)  
**AI provider:** Google Gemini API  

## 1. Executive Summary & Vision
AI Mystery Room is an interactive, AI-powered mystery investigation game where users act as lead detectives solving fictional crimes and suspicious incidents generated from user-provided premises.

### Core Product Principle
**Every mystery must be solvable using the evidence provided, and the intended culprit must be determined before the user begins investigating.** The AI does not change the culprit, timeline, or motives after investigation starts.

## 2. Key Capabilities
1. **Dynamic Case Generation:** Uses Google Gemini (with deterministic mock fallback for offline dev/tests) to generate structured mysteries based on user scenarios, difficulty, and genre.
2. **Deterministic Pre-determined Culprit:** Exactly one culprit established upfront with a coherent timeline, motive, and evidence.
3. **Multi-Format Evidence System:**
   - Fictional WhatsApp/chat logs
   - CCTV surveillance logs with still-frame simulation
   - Crime scene & forensic image inspection
   - Witness statements & transcripts
   - Official documents, receipts, logs
   - Forensic lab reports
4. **Detective Workspace (Investigation Room):**
   - Suspect dossier with alibis and relationships
   - Evidence inspector with type-specific rich viewers
   - Detective notebook with bookmarks, reviewed tracker, and personal notes
5. **Accusation & Verdict Evaluation:**
   - Single-attempt culprit selection with reasoning
   - Deterministic backend comparison against hidden solution (no AI evaluation hallucination)
   - Detailed revelation report displaying the truth, decisive clues, and red herring explanations
6. **Solution Privacy:** Hidden solution and culprit IDs are strictly protected on the server until the post-verdict phase.

## 3. Technology Stack
- **Frontend:** React 18/19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router.
- **Backend:** Node.js, Express, TypeScript, Mongoose, Zod schema validation, Helmet, CORS.
- **Database:** MongoDB (with built-in automated in-memory fallback for instant dev/testing).
- **AI Engine:** Google Gemini API (`@google/genai`) with structured JSON mode and multi-stage consistency validation.
- **Quality & Testing:** Vitest, Supertest, React Testing Library.
