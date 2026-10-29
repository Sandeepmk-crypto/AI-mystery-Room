import mongoose, { Schema, Document } from "mongoose";

export interface IEvidenceDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  manifestId: string;
  title: string;
  type:
    | "chat"
    | "image"
    | "cctv"
    | "witness_statement"
    | "document"
    | "forensic_report"
    | "timeline";
  description: string;
  source: string;
  timestamp?: string;
  relatedSuspectIds: mongoose.Types.ObjectId[];
  content: Record<string, unknown>;
  clues: Array<{
    id: string;
    description: string;
    importance: "minor" | "important" | "critical";
  }>;
  media: Array<{
    kind: "image" | "video" | "audio";
    url: string;
    mimeType?: string;
    generated: boolean;
  }>;
  visibility: "public" | "post_verdict";
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema = new Schema<IEvidenceDocument>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    manifestId: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "chat",
        "image",
        "cctv",
        "witness_statement",
        "document",
        "forensic_report",
        "timeline",
      ],
      required: true,
    },
    description: { type: String, required: true },
    source: { type: String, required: true },
    timestamp: { type: String },
    relatedSuspectIds: [{ type: Schema.Types.ObjectId, ref: "Suspect" }],
    content: { type: Schema.Types.Mixed, required: true },
    clues: [
      {
        id: { type: String, required: true },
        description: { type: String, required: true },
        importance: { type: String, enum: ["minor", "important", "critical"], required: true },
      },
    ],
    media: [
      {
        kind: { type: String, enum: ["image", "video", "audio"] },
        url: { type: String },
        mimeType: { type: String },
        generated: { type: Boolean, default: false },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "post_verdict"],
      default: "public",
    },
  },
  { timestamps: true }
);

EvidenceSchema.index({ caseId: 1, type: 1 });

export const EvidenceModel = mongoose.model<IEvidenceDocument>("Evidence", EvidenceSchema);
