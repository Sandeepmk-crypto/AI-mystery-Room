# UI/UX Specification

## 1. Visual Theme
- **Detective Darkroom Aesthetic:**
  - Backgrounds: Dark slate & charcoal (`#090b10`, `#0f172a`, `#1e293b`).
  - Warm amber / sepia highlights (`#f59e0b`, `#d97706`).
  - Crimson / red investigation accents (`#ef4444`, `#b91c1c`).
  - Monospace & dossier typography accents.

## 2. Core Pages & Layouts
- **Landing Page (`/`):** Hero with atmospheric backdrop, feature showcase, sample case cards, "Create a Mystery" CTA.
- **Case Creation (`/create`):** Rich scenario textarea with preset prompts ("The Manor Poisoning", "Silicon Valley Sabotage", "The Missing Diamond"), difficulty badges, genre pills, length picker, dramatic generation loader with animated status steps.
- **Case Briefing (`/cases/:caseId`):** Police incident file header, location, timestamps, suspect roster previews, "Enter Investigation Room" CTA.
- **Investigation Workspace (`/cases/:caseId/investigate`):**
  - Left Column: Suspect Dossiers (photos, alibis, motives) & Filterable Evidence List (with indicators for unread/reviewed/bookmarked).
  - Center Workspace: Dedicated evidence viewers:
    - Chat View (WhatsApp style messages, timestamps, contact headers)
    - CCTV Monitor (video player framing, timestamp OSD, scanlines, timeline logs, still frames)
    - Crime Scene Photos (high-res display, zoom modal, forensics notes)
    - Documents & Receipts (paper texture, stamp markings, transcript)
    - Witness Statements (quote styling, witness details)
    - Forensic Reports (lab seal, chemical/DNA analysis results)
  - Right Column / Drawer: Detective Notebook (personal notes, bookmark tray, reviewed tracker, "Accuse Suspect" action button).
- **Accusation Modal:** Suspect lineup cards, justification input, double confirmation step to avoid accidental submission.
- **Verdict & Case Revelation (`/investigations/:investigationId/result`):**
  - Big dramatic banner (CASE SOLVED / WRONG ACCUSATION).
  - Reveal actual culprit, motive, and method.
  - Decisive clues step-by-step walkthrough.
  - Red herrings explained.
