import mongoose from "mongoose";
import { VerdictOutcome } from "@ai-mystery-room/shared";
import { InvestigationModel } from "../../models/investigation.model.js";
import { CaseModel } from "../../models/case.model.js";
import { SuspectModel } from "../../models/suspect.model.js";
import { EvidenceModel } from "../../models/evidence.model.js";
import { investigationService } from "../investigations/investigation.service.js";

export class VerdictService {
  public async submitAccusation(
    investigationId: string,
    rawToken: string,
    accusedSuspectId: string,
    reasoning?: string
  ): Promise<VerdictOutcome> {
    // 1. Authenticate the investigation session
    const investigation = await investigationService.verifySession(investigationId, rawToken);

    // 2. Prevent duplicate submissions (single-attempt rule)
    if (investigation.status === "completed" || investigation.accusation?.suspectId) {
      const err: any = new Error("This investigation has already submitted an accusation.");
      err.code = "ALREADY_COMPLETED";
      err.statusCode = 409;
      throw err;
    }

    // 3. Validate accused suspect belongs to this case
    if (!mongoose.Types.ObjectId.isValid(accusedSuspectId)) {
      const err: any = new Error("Invalid suspect ID provided.");
      err.code = "VALIDATION_ERROR";
      err.statusCode = 400;
      throw err;
    }

    const accusedSuspect = await SuspectModel.findOne({
      _id: accusedSuspectId,
      caseId: investigation.caseId,
    });

    if (!accusedSuspect) {
      const err: any = new Error("The accused suspect does not belong to this case.");
      err.code = "VALIDATION_ERROR";
      err.statusCode = 400;
      throw err;
    }

    // 4. Retrieve Case & Hidden Solution
    const caseDoc = await CaseModel.findById(investigation.caseId);
    if (!caseDoc) {
      const err: any = new Error("Associated case not found.");
      err.code = "CASE_NOT_FOUND";
      err.statusCode = 404;
      throw err;
    }

    // 5. Identify the true culprit suspect record
    const culpritSuspect = await SuspectModel.findOne({
      caseId: caseDoc._id,
      $or: [
        { manifestId: caseDoc.solution.culpritId },
        ...(mongoose.Types.ObjectId.isValid(caseDoc.solution.culpritId)
          ? [{ _id: new mongoose.Types.ObjectId(caseDoc.solution.culpritId) }]
          : []),
      ],
    });

    if (!culpritSuspect) {
      throw new Error("Internal consistency error: culprit suspect not found.");
    }

    // 6. Compare deterministic IDs
    const isCorrect =
      (accusedSuspect._id as mongoose.Types.ObjectId).toString() ===
      (culpritSuspect._id as mongoose.Types.ObjectId).toString();

    // 7. Atomically save the accusation and complete the investigation
    investigation.accusation = {
      suspectId: accusedSuspect._id as mongoose.Types.ObjectId,
      reasoning: reasoning || "",
      isCorrect,
      submittedAt: new Date(),
    };
    investigation.status = "completed";
    await investigation.save();

    // 8. Map decisive evidence IDs to public MongoDB IDs where applicable
    const decisiveManifestIds = caseDoc.solution.decisiveEvidenceIds || [];
    const decisiveEvidenceDocs = await EvidenceModel.find({
      caseId: caseDoc._id,
      $or: [
        { manifestId: { $in: decisiveManifestIds } },
        { _id: { $in: decisiveManifestIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } },
      ],
    }).select("_id manifestId");

    const resolvedDecisiveIds = decisiveEvidenceDocs.map((e) =>
      (e._id as mongoose.Types.ObjectId).toString()
    );

    // 9. Return post-verdict solution
    return {
      status: "completed",
      isCorrect,
      selectedSuspect: {
        id: (accusedSuspect._id as mongoose.Types.ObjectId).toString(),
        name: accusedSuspect.name,
      },
      solution: {
        culprit: {
          id: (culpritSuspect._id as mongoose.Types.ObjectId).toString(),
          name: culpritSuspect.name,
        },
        motive: caseDoc.solution.motive,
        method: caseDoc.solution.method,
        explanation: caseDoc.solution.explanation,
        decisiveEvidenceIds: resolvedDecisiveIds.length > 0 ? resolvedDecisiveIds : decisiveManifestIds,
        redHerringExplanations: caseDoc.solution.redHerringExplanations || [],
      },
    };
  }
}

export const verdictService = new VerdictService();
