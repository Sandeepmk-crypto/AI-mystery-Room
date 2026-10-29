import mongoose, { Schema, Document } from "mongoose";

export interface IInvestigationDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  sessionTokenHash: string;
  status: "active" | "completed";
  reviewedEvidenceIds: mongoose.Types.ObjectId[];
  bookmarkedEvidenceIds: mongoose.Types.ObjectId[];
  notes: Array<{
    evidenceId?: mongoose.Types.ObjectId;
    text: string;
    updatedAt: Date;
  }>;
  accusation?: {
    suspectId: mongoose.Types.ObjectId;
    reasoning?: string;
    isCorrect: boolean;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InvestigationSchema = new Schema<IInvestigationDocument>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    sessionTokenHash: { type: String, required: true },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    reviewedEvidenceIds: [{ type: Schema.Types.ObjectId, ref: "Evidence" }],
    bookmarkedEvidenceIds: [{ type: Schema.Types.ObjectId, ref: "Evidence" }],
    notes: [
      {
        evidenceId: { type: Schema.Types.ObjectId, ref: "Evidence" },
        text: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    accusation: {
      type: new Schema(
        {
          suspectId: { type: Schema.Types.ObjectId, ref: "Suspect" },
          reasoning: { type: String },
          isCorrect: { type: Boolean },
          submittedAt: { type: Date },
        },
        { _id: false }
      ),
      default: undefined,
    },
  },
  { timestamps: true }
);

InvestigationSchema.index({ caseId: 1, createdAt: -1 });
InvestigationSchema.index({ sessionTokenHash: 1 });

export const InvestigationModel = mongoose.model<IInvestigationDocument>(
  "Investigation",
  InvestigationSchema
);
