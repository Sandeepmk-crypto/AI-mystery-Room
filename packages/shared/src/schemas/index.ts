import { z } from "zod";

export const DifficultySchema = z.enum(["easy", "medium", "hard"]);
export const CaseLengthSchema = z.enum(["short", "standard", "extended"]);
export const EvidenceTypeSchema = z.enum([
  "chat",
  "image",
  "cctv",
  "witness_statement",
  "document",
  "forensic_report",
  "timeline",
]);
export const ClueImportanceSchema = z.enum(["minor", "important", "critical"]);

export const CreateCaseInputSchema = z.object({
  scenario: z
    .string()
    .trim()
    .min(10, "Scenario premise must be at least 10 characters long")
    .max(3000, "Scenario premise cannot exceed 3000 characters"),
  settings: z
    .object({
      difficulty: DifficultySchema.default("medium"),
      genre: z.string().trim().min(2).max(50).default("Detective Mystery"),
      length: CaseLengthSchema.default("standard"),
    })
    .default({
      difficulty: "medium",
      genre: "Detective Mystery",
      length: "standard",
    }),
});

export type CreateCaseInput = z.infer<typeof CreateCaseInputSchema>;

export const UpdateProgressInputSchema = z.object({
  reviewedEvidenceIds: z.array(z.string()).optional(),
  bookmarkedEvidenceIds: z.array(z.string()).optional(),
});

export type UpdateProgressInput = z.infer<typeof UpdateProgressInputSchema>;

export const SaveNotesInputSchema = z.object({
  notes: z.array(
    z.object({
      evidenceId: z.string().optional(),
      text: z.string().max(2000),
    })
  ),
});

export type SaveNotesInput = z.infer<typeof SaveNotesInputSchema>;

export const AccusationInputSchema = z.object({
  suspectId: z.string().min(1, "Please select a suspect to accuse"),
  reasoning: z.string().max(2000).optional(),
});

export type AccusationInput = z.infer<typeof AccusationInputSchema>;

// Clue and Media Schemas
export const ClueItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  importance: ClueImportanceSchema,
});

export const MediaAssetSchema = z.object({
  kind: z.enum(["image", "video", "audio"]),
  url: z.string(),
  mimeType: z.string().optional(),
  generated: z.boolean().default(false),
});

// Evidence Content Schemas
export const ChatMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  text: z.string(),
  timestamp: z.string(),
  isKeyClue: z.boolean().optional(),
});

export const ChatEvidenceContentSchema = z.object({
  participants: z.array(
    z.object({
      suspectId: z.string().optional(),
      displayName: z.string(),
      avatarUrl: z.string().optional(),
    })
  ),
  messages: z.array(ChatMessageSchema),
});

export const CCTVEventSchema = z.object({
  time: z.string(),
  description: z.string(),
  suspiciousFactor: z.string().optional(),
});

export const CCTVEvidenceContentSchema = z.object({
  cameraName: z.string(),
  location: z.string(),
  timeRange: z.string(),
  sceneDescription: z.string(),
  blindSpotsOrGaps: z.string().optional(),
  quality: z.string().optional(),
  events: z.array(CCTVEventSchema),
  stillFrameUrl: z.string().optional(),
});

export const ImageAnnotationSchema = z.object({
  area: z.string(),
  note: z.string(),
});

export const ImageEvidenceContentSchema = z.object({
  imageTitle: z.string(),
  caption: z.string(),
  annotations: z.array(ImageAnnotationSchema),
  imageUrl: z.string(),
  photographerOrSource: z.string().optional(),
});

export const DocumentEvidenceContentSchema = z.object({
  documentType: z.string(),
  officialHeader: z.string(),
  bodyText: z.string(),
  signaturesOrMarks: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
});

export const WitnessEvidenceContentSchema = z.object({
  witnessName: z.string(),
  interviewer: z.string(),
  statementDate: z.string(),
  transcript: z.string(),
  demeanor: z.string().optional(),
});

export const ForensicEvidenceContentSchema = z.object({
  labName: z.string(),
  examiner: z.string(),
  sampleAnalyzed: z.string(),
  findings: z.array(z.string()),
  conclusion: z.string(),
});

export const TimelineEventItemSchema = z.object({
  time: z.string(),
  event: z.string(),
  source: z.string(),
  confirmed: z.boolean().default(true),
});

export const TimelineEvidenceContentSchema = z.object({
  events: z.array(TimelineEventItemSchema),
});

// Canonical Manifest Schema for validation of generator output
export const ManifestSuspectSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().optional(),
  occupation: z.string().optional(),
  relationshipToIncident: z.string(),
  background: z.string(),
  alibi: z.string(),
  possibleMotive: z.string(),
});

export const ManifestEvidenceSchema = z.object({
  id: z.string(),
  type: EvidenceTypeSchema,
  title: z.string(),
  description: z.string(),
  source: z.string(),
  timestamp: z.string().optional(),
  relatedSuspectIds: z.array(z.string()),
  clues: z.array(ClueItemSchema),
  media: z.array(MediaAssetSchema).optional(),
  content: z.record(z.any()), // Checked and structured per evidence type
});

export const ManifestSolutionSchema = z.object({
  culpritId: z.string(),
  motive: z.string(),
  method: z.string(),
  timeline: z.array(
    z.object({
      time: z.string(),
      event: z.string(),
    })
  ),
  explanation: z.string(),
  decisiveEvidenceIds: z.array(z.string()).min(1, "Must have at least one decisive evidence artifact"),
  redHerringExplanations: z.array(z.string()).default([]),
});

export const CaseManifestSchema = z.object({
  case: z.object({
    title: z.string().min(3),
    incident: z.object({
      summary: z.string().min(10),
      date: z.string().optional(),
      time: z.string().optional(),
      location: z.string().min(2),
    }),
  }),
  suspects: z.array(ManifestSuspectSchema).min(3, "At least 3 suspects are required").max(6, "Maximum 6 suspects"),
  evidence: z.array(ManifestEvidenceSchema).min(4, "Must have at least 4 evidence items"),
  solution: ManifestSolutionSchema,
});

export type CaseManifestInput = z.infer<typeof CaseManifestSchema>;
