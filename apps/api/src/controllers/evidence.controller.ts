import { Request, Response, NextFunction } from "express";
import { caseService } from "../services/cases/case.service.js";

export async function listEvidenceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { caseId } = req.params;
    const { type, suspectId } = req.query;

    const evidenceList = await caseService.getEvidenceList(caseId, {
      type: type as string | undefined,
      suspectId: suspectId as string | undefined,
    });

    res.json(evidenceList);
  } catch (err) {
    next(err);
  }
}

export async function getEvidenceDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { caseId, evidenceId } = req.params;
    const evidence = await caseService.getEvidenceDetail(caseId, evidenceId);

    if (!evidence) {
      res.status(404).json({
        error: {
          code: "EVIDENCE_NOT_FOUND",
          message: `Evidence with ID '${evidenceId}' was not found in this case.`,
        },
      });
      return;
    }

    res.json(evidence);
  } catch (err) {
    next(err);
  }
}
