import mongoose, { Schema, Document } from "mongoose";

export interface ISuspectDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  manifestId: string;
  name: string;
  age?: number;
  occupation?: string;
  relationshipToIncident: string;
  background: string;
  alibi: string;
  possibleMotive: string;
  createdAt: Date;
  updatedAt: Date;
}

const SuspectSchema = new Schema<ISuspectDocument>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    manifestId: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number },
    occupation: { type: String },
    relationshipToIncident: { type: String, required: true },
    background: { type: String, required: true },
    alibi: { type: String, required: true },
    possibleMotive: { type: String, required: true },
  },
  { timestamps: true }
);

SuspectSchema.index({ caseId: 1 });

export const SuspectModel = mongoose.model<ISuspectDocument>("Suspect", SuspectSchema);
