# AI Generation Specification

## 1. Provider & Pipeline
- Uses official Google Gen AI SDK (`@google/genai` or `@google/generative-ai`).
- Multi-tier validation:
  1. System Prompt enforces structured JSON schema output with strict constraints.
  2. Runtime Zod Schema verification.
  3. Deterministic cross-reference verification (culprit exists in suspects, decisiveEvidenceIds exist in evidence, clues reference valid events, timeline consistency).
  4. Bounded retries: 2 retry attempts with error feedback if output is structurally invalid.
  5. Mock Case Generator: Provides instant, rich, reproducible cases when `USE_MOCK_AI=true` or when no Gemini API key is configured.

## 2. Invariants
- Exactly 1 intended culprit selected prior to evidence generation.
- No paradoxes: Clues pointing to the culprit must be conclusive when synthesized. Red herrings must have logical innocent explanations.
- Public responses must NEVER leak culpritId, hidden solution narrative, or decisive evidence lists.
