import mongoose, { Schema, Document } from "mongoose";

export interface ICaseDocument extends Document {
  title: string;
  scenario: string;
  settings: {
    difficulty: "easy" | "medium" | "hard";
    genre: string;
    length: "short" | "standard" | "extended";
  };
  status: "generating" | "validating" | "ready" | "failed";
  incident: {
    summary: string;
    date?: string;
    time?: string;
    location: string;
  };
  suspectIds: mongoose.Types.ObjectId[];
  evidenceIds: mongoose.Types.ObjectId[];
  solution: {
    culpritId: string; // manifest ID string (e.g. "suspect_01")
    motive: string;
    method: string;
    timeline: Array<{
      time: string;
      event: string;
    }>;
    explanation: string;
    decisiveEvidenceIds: string[];
    redHerringExplanations: string[];
  };
  generation: {
    model: string;
    promptVersion: string;
    attemptCount: number;
    generatedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICaseDocument>(
  {
    title: { type: String, required: true },
    scenario: { type: String, required: true },
    settings: {
      difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
      genre: { type: String, default: "Detective Mystery" },
      length: { type: String, enum: ["short", "standard", "extended"], default: "standard" },
    },
    status: {
      type: String,
      enum: ["generating", "validating", "ready", "failed"],
      default: "ready",
    },
    incident: {
      summary: { type: String, required: true },
      date: { type: String },
      time: { type: String },
      location: { type: String, required: true },
    },
    suspectIds: [{ type: Schema.Types.ObjectId, ref: "Suspect" }],
    evidenceIds: [{ type: Schema.Types.ObjectId, ref: "Evidence" }],
    solution: {
      culpritId: { type: String, required: true },
      motive: { type: String, required: true },
      method: { type: String, required: true },
      timeline: [
        {
          time: { type: String, required: true },
          event: { type: String, required: true },
        },
      ],
      explanation: { type: String, required: true },
      decisiveEvidenceIds: [{ type: String, required: true }],
      redHerringExplanations: [{ type: String }],
    },
    generation: {
      model: { type: String, default: "gemini" },
      promptVersion: { type: String, default: "1.0.0" },
      attemptCount: { type: Number, default: 1 },
      generatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

CaseSchema.index({ status: 1, createdAt: -1 });

export const CaseModel = mongoose.model<ICaseDocument>("Case", CaseSchema);
