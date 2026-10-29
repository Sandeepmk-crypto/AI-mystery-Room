import { GoogleGenerativeAI } from "@google/generative-ai";
import { CaseManifest, CaseSettings } from "@ai-mystery-room/shared";
import { CaseManifestSchema } from "@ai-mystery-room/shared";
import { ENV } from "../../config/env.js";
import { generateMockCaseManifest } from "./mock.generator.js";

const SYSTEM_PROMPT = `You are the master mystery architect for AI Mystery Room.
Generate a complete, internally consistent, solvable fictional mystery investigation in raw JSON format.

CRITICAL ARCHITECTURAL RULES:
1. Every character, incident, and artifact must be 100% fictional.
2. Establish EXACTLY ONE intended culprit before generating evidence.
3. Every evidence item must be an artifact: chat logs, CCTV footage logs, crime scene photos, witness statements, documents/receipts, or forensic reports.
4. The intended culprit MUST be uniquely distinguishable through the synthesis of the decisive clues.
5. All timestamps must be mathematically and narratively coherent.
6. Include 1 or 2 plausible red herrings (innocent suspects who look suspicious but whose alibis or circumstances are logically explained by evidence).
7. DO NOT reveal the culprit or solution in the public titles, incident summaries, or suspect descriptions.
8. Output ONLY valid raw JSON without conversational filler.

SCHEMA FORMAT:
{
  "case": {
    "title": "A captivating mystery title",
    "incident": {
      "summary": "Fictional crime/incident description",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "location": "Fictional setting"
    }
  },
  "suspects": [
    {
      "id": "suspect_01",
      "name": "Full Name",
      "age": 35,
      "occupation": "Job Title",
      "relationshipToIncident": "How they connect",
      "background": "Public background",
      "alibi": "Their claimed whereabouts during the critical window",
      "possibleMotive": "Why they could have done it"
    }
  ],
  "evidence": [
    {
      "id": "evidence_01",
      "type": "chat" | "cctv" | "image" | "witness_statement" | "document" | "forensic_report" | "timeline",
      "title": "Title of artifact",
      "description": "Short description of artifact",
      "source": "Origin of evidence",
      "timestamp": "ISO or formatted timestamp",
      "relatedSuspectIds": ["suspect_01"],
      "clues": [
        {
          "id": "clue_01",
          "description": "Deduction or hint gleaned from this artifact",
          "importance": "minor" | "important" | "critical"
        }
      ],
      "content": { ...type-specific content object matching the evidence type... }
    }
  ],
  "solution": {
    "culpritId": "suspect_01",
    "motive": "The true hidden motive",
    "method": "How the crime was committed",
    "timeline": [
      { "time": "HH:MM", "event": "What happened" }
    ],
    "explanation": "Clear comprehensive explanation solving the case",
    "decisiveEvidenceIds": ["evidence_01"],
    "redHerringExplanations": [
      "Why suspect_02 was innocent and how evidence disproves their guilt"
    ]
  }
}`;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim() !== "") {
      this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    }
  }

  public async generateCase(
    scenario: string,
    settings: CaseSettings,
    maxRetries = 2
  ): Promise<CaseManifest> {
    // If mock AI is enabled or no Gemini API key, use the deterministic mock generator
    if (ENV.USE_MOCK_AI || !this.genAI) {
      console.log("[AI Generator] Using deterministic mock case generator.");
      return generateMockCaseManifest(scenario, settings);
    }

    const model = this.genAI.getGenerativeModel({
      model: ENV.GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = `Generate a complete mystery case based on this user scenario:
"${scenario}"

Case Parameters:
- Difficulty: ${settings.difficulty}
- Genre: ${settings.genre}
- Length: ${settings.length} (short: 5-7 evidence artifacts, standard: 8-12 artifacts, extended: 13-18 artifacts)
- Suspects: 3 to 5 suspects
- Ensure exactly one culprit whose guilt is definitively proved by the decisive evidence.`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`[AI Generator] Calling Gemini API (attempt ${attempt}/${maxRetries + 1})...`);
        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        // Sanitize any markdown wrappers if returned
        const cleanedJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(cleanedJson);

        // Validate using Zod schema
        const validated = CaseManifestSchema.parse(parsed);

        // Consistency check: ensure culpritId exists in suspects list
        const suspectIds = new Set(validated.suspects.map((s) => s.id));
        if (!suspectIds.has(validated.solution.culpritId)) {
          throw new Error(
            `Consistency Error: Culprit ID '${validated.solution.culpritId}' is not among generated suspects.`
          );
        }

        // Consistency check: ensure decisive evidence exists
        const evidenceIds = new Set(validated.evidence.map((e) => e.id));
        for (const decId of validated.solution.decisiveEvidenceIds) {
          if (!evidenceIds.has(decId)) {
            throw new Error(`Consistency Error: Decisive evidence ID '${decId}' does not exist.`);
          }
        }

        console.log(`[AI Generator] Successfully generated and validated mystery: "${validated.case.title}"`);
        return validated as CaseManifest;
      } catch (err: any) {
        console.warn(`[AI Generator] Attempt ${attempt} failed: ${err.message}`);
        lastError = err;
      }
    }

    console.error("[AI Generator] All Gemini generation attempts failed. Falling back to deterministic generator.");
    return generateMockCaseManifest(scenario, settings);
  }
}

export const geminiService = new GeminiService();
