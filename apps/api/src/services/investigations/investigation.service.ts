import crypto from "crypto";
import mongoose from "mongoose";
import { InvestigationPublic, UpdateProgressInput, SaveNotesInput } from "@ai-mystery-room/shared";
import { InvestigationModel, IInvestigationDocument } from "../../models/investigation.model.js";
import { EvidenceModel } from "../../models/evidence.model.js";

export class InvestigationService {
  public hashToken(rawToken: string): string {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
  }

  public async verifySession(
    investigationId: string,
    rawToken: string
  ): Promise<IInvestigationDocument> {
    if (!mongoose.Types.ObjectId.isValid(investigationId)) {
      throw new Error("INVESTIGATION_NOT_FOUND");
    }

    const investigation = await InvestigationModel.findById(investigationId);
    if (!investigation) {
      throw new Error("INVESTIGATION_NOT_FOUND");
    }

    if (!rawToken) {
      throw new Error("INVALID_SESSION");
    }

    const providedHash = this.hashToken(rawToken.trim());
    if (providedHash !== investigation.sessionTokenHash) {
      throw new Error("INVALID_SESSION");
    }

    return investigation;
  }

  public async getInvestigation(investigationId: string): Promise<InvestigationPublic | null> {
    if (!mongoose.Types.ObjectId.isValid(investigationId)) return null;

    const doc = await InvestigationModel.findById(investigationId);
    if (!doc) return null;

    return {
      id: (doc._id as mongoose.Types.ObjectId).toString(),
      caseId: doc.caseId.toString(),
      status: doc.status,
      reviewedEvidenceIds: doc.reviewedEvidenceIds.map((id) => id.toString()),
      bookmarkedEvidenceIds: doc.bookmarkedEvidenceIds.map((id) => id.toString()),
      notes: doc.notes.map((n) => ({
        evidenceId: n.evidenceId ? n.evidenceId.toString() : undefined,
        text: n.text,
        updatedAt: n.updatedAt.toISOString(),
      })),
      accusation: doc.accusation?.suspectId
        ? {
            suspectId: doc.accusation.suspectId.toString(),
            reasoning: doc.accusation.reasoning,
            isCorrect: Boolean(doc.accusation.isCorrect),
            submittedAt: doc.accusation.submittedAt
              ? doc.accusation.submittedAt.toISOString()
              : new Date().toISOString(),
          }
        : undefined,
    };
  }

  public async updateProgress(
    investigationId: string,
    input: UpdateProgressInput
  ): Promise<InvestigationPublic> {
    const investigation = await InvestigationModel.findById(investigationId);
    if (!investigation) throw new Error("INVESTIGATION_NOT_FOUND");

    if (input.reviewedEvidenceIds) {
      // Validate that all reviewedEvidenceIds belong to this case
      const validEvidence = await EvidenceModel.find({
        _id: { $in: input.reviewedEvidenceIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) },
        caseId: investigation.caseId,
      }).select("_id");
      investigation.reviewedEvidenceIds = validEvidence.map((e) => e._id as mongoose.Types.ObjectId);
    }

    if (input.bookmarkedEvidenceIds) {
      // Validate that all bookmarkedEvidenceIds belong to this case
      const validEvidence = await EvidenceModel.find({
        _id: { $in: input.bookmarkedEvidenceIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) },
        caseId: investigation.caseId,
      }).select("_id");
      investigation.bookmarkedEvidenceIds = validEvidence.map((e) => e._id as mongoose.Types.ObjectId);
    }

    await investigation.save();
    return (await this.getInvestigation(investigationId))!;
  }

  public async saveNotes(
    investigationId: string,
    input: SaveNotesInput
  ): Promise<InvestigationPublic> {
    const investigation = await InvestigationModel.findById(investigationId);
    if (!investigation) throw new Error("INVESTIGATION_NOT_FOUND");

    investigation.notes = input.notes.map((n) => ({
      evidenceId:
        n.evidenceId && mongoose.Types.ObjectId.isValid(n.evidenceId)
          ? new mongoose.Types.ObjectId(n.evidenceId)
          : undefined,
      text: n.text,
      updatedAt: new Date(),
    }));

    await investigation.save();
    return (await this.getInvestigation(investigationId))!;
  }
}

export const investigationService = new InvestigationService();
