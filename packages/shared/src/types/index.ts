export type Difficulty = "easy" | "medium" | "hard";
export type CaseLength = "short" | "standard" | "extended";
export type EvidenceType =
  | "chat"
  | "image"
  | "cctv"
  | "witness_statement"
  | "document"
  | "forensic_report"
  | "timeline";

export type ClueImportance = "minor" | "important" | "critical";

export interface CaseSettings {
  difficulty: Difficulty;
  genre: string;
  length: CaseLength;
}

export interface IncidentDetails {
  summary: string;
  date?: string;
  time?: string;
  location: string;
}

export interface CaseSolution {
  culpritId: string;
  motive: string;
  method: string;
  timeline: Array<{
    time: string;
    event: string;
  }>;
  explanation: string;
  decisiveEvidenceIds: string[];
  redHerringExplanations: string[];
}

export interface SuspectPublic {
  id: string;
  caseId: string;
  manifestId?: string;
  name: string;
  age?: number;
  occupation?: string;
  relationshipToIncident: string;
  background: string;
  alibi: string;
  possibleMotive: string;
}

export interface ClueItem {
  id: string;
  description: string;
  importance: ClueImportance;
}

export interface MediaAsset {
  kind: "image" | "video" | "audio";
  url: string;
  mimeType?: string;
  generated: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isKeyClue?: boolean;
}

export interface ChatEvidenceContent {
  participants: Array<{
    suspectId?: string;
    displayName: string;
    avatarUrl?: string;
  }>;
  messages: ChatMessage[];
}

export interface CCTVEvent {
  time: string;
  description: string;
  suspiciousFactor?: string;
}

export interface CCTVEvidenceContent {
  cameraName: string;
  location: string;
  timeRange: string;
  sceneDescription: string;
  blindSpotsOrGaps?: string;
  quality?: string;
  events: CCTVEvent[];
  stillFrameUrl?: string;
}

export interface ImageAnnotation {
  area: string;
  note: string;
}

export interface ImageEvidenceContent {
  imageTitle: string;
  caption: string;
  annotations: ImageAnnotation[];
  imageUrl: string;
  photographerOrSource?: string;
}

export interface DocumentEvidenceContent {
  documentType: string;
  officialHeader: string;
  bodyText: string;
  signaturesOrMarks?: string[];
  metadata?: Record<string, string>;
}

export interface WitnessEvidenceContent {
  witnessName: string;
  interviewer: string;
  statementDate: string;
  transcript: string;
  demeanor?: string;
}

export interface ForensicEvidenceContent {
  labName: string;
  examiner: string;
  sampleAnalyzed: string;
  findings: string[];
  conclusion: string;
}

export interface TimelineEventItem {
  time: string;
  event: string;
  source: string;
  confirmed: boolean;
}

export interface TimelineEvidenceContent {
  events: TimelineEventItem[];
}

export type EvidenceContent =
  | ChatEvidenceContent
  | CCTVEvidenceContent
  | ImageEvidenceContent
  | DocumentEvidenceContent
  | WitnessEvidenceContent
  | ForensicEvidenceContent
  | TimelineEvidenceContent;

export interface EvidencePublic {
  id: string;
  caseId: string;
  manifestId?: string;
  title: string;
  type: EvidenceType;
  description: string;
  source: string;
  timestamp?: string;
  relatedSuspectIds: string[];
  clues: ClueItem[];
  media: MediaAsset[];
  visibility: "public" | "post_verdict";
  content: EvidenceContent;
}

export interface CasePublic {
  id: string;
  title: string;
  scenario: string;
  status: "generating" | "validating" | "ready" | "failed";
  settings: CaseSettings;
  incident: IncidentDetails;
  suspects: SuspectPublic[];
  evidenceSummary: Array<{
    id: string;
    title: string;
    type: EvidenceType;
    description: string;
    source: string;
    timestamp?: string;
    clueCount: number;
    relatedSuspectIds: string[];
  }>;
  createdAt: string;
}

export interface InvestigationNote {
  evidenceId?: string;
  text: string;
  updatedAt: string;
}

export interface InvestigationPublic {
  id: string;
  caseId: string;
  status: "active" | "completed";
  reviewedEvidenceIds: string[];
  bookmarkedEvidenceIds: string[];
  notes: InvestigationNote[];
  accusation?: {
    suspectId: string;
    reasoning?: string;
    isCorrect: boolean;
    submittedAt: string;
  };
}

export interface VerdictOutcome {
  status: "completed";
  isCorrect: boolean;
  selectedSuspect: {
    id: string;
    name: string;
  };
  solution: {
    culprit: {
      id: string;
      name: string;
    };
    motive: string;
    method: string;
    explanation: string;
    decisiveEvidenceIds: string[];
    redHerringExplanations: string[];
  };
}

// Canonical Raw Manifest produced by Generator (Gemini or Mock)
export interface ManifestSuspect {
  id: string; // e.g. "suspect_01"
  name: string;
  age?: number;
  occupation?: string;
  relationshipToIncident: string;
  background: string;
  alibi: string;
  possibleMotive: string;
}

export interface ManifestEvidence {
  id: string; // e.g. "evidence_01"
  type: EvidenceType;
  title: string;
  description: string;
  source: string;
  timestamp?: string;
  relatedSuspectIds: string[];
  clues: ClueItem[];
  media?: MediaAsset[];
  content: EvidenceContent;
}

export interface CaseManifest {
  case: {
    title: string;
    incident: IncidentDetails;
  };
  suspects: ManifestSuspect[];
  evidence: ManifestEvidence[];
  solution: CaseSolution;
}
