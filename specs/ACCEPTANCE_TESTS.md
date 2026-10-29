# Acceptance Tests Specification

## Test Matrix

1. **Case Creation:**
   - Valid scenario generates playable case with unique suspects, evidence, and exactly 1 culprit.
   - Scenario input < 10 chars or empty rejected with 400.
2. **Hidden Solution Invariant:**
   - Pre-verdict GET `/cases/:id`, GET `/cases/:id/suspects`, GET `/cases/:id/evidence` must NOT expose culpritId, solution, or decisiveEvidenceIds.
3. **Session Authentication:**
   - Operations on `/investigations/:id` require valid session token hash matching stored hash.
4. **Notebook & Progress:**
   - Toggling bookmarks and marking evidence as reviewed persists across sessions.
   - User notes can be saved and retrieved.
5. **Accusation & Verdict:**
   - Accusing the correct suspect returns `isCorrect: true`, reveals solution and decisive clues.
   - Accusing an incorrect suspect returns `isCorrect: false`, reveals actual culprit and solution.
   - Subsequent accusations on the same investigation are rejected (`409 Conflict` or `400 Bad Request`).
