import { Request, Response, NextFunction } from "express";
import { investigationService } from "../services/investigations/investigation.service.js";
import { verdictService } from "../services/verdict/verdict.service.js";

export async function getInvestigationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { investigationId } = req.params;
    const sessionToken = req.sessionToken!;

    // Authenticate session
    await investigationService.verifySession(investigationId, sessionToken);

    const data = await investigationService.getInvestigation(investigationId);
    if (!data) {
      res.status(404).json({
        error: {
          code: "INVESTIGATION_NOT_FOUND",
          message: "Investigation not found.",
        },
      });
      return;
    }

    res.json(data);
  } catch (err: any) {
    if (err.message === "INVALID_SESSION") {
      res.status(403).json({
        error: {
          code: "INVALID_SESSION",
          message: "Invalid or unauthorized session token for this investigation.",
        },
      });
      return;
    }
    if (err.message === "INVESTIGATION_NOT_FOUND") {
      res.status(404).json({
        error: {
          code: "INVESTIGATION_NOT_FOUND",
          message: "Investigation not found.",
        },
      });
      return;
    }
    next(err);
  }
}

export async function updateProgressHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { investigationId } = req.params;
    const sessionToken = req.sessionToken!;

    await investigationService.verifySession(investigationId, sessionToken);
    const updated = await investigationService.updateProgress(investigationId, req.body);
    res.json(updated);
  } catch (err: any) {
    if (err.message === "INVALID_SESSION") {
      res.status(403).json({
        error: {
          code: "INVALID_SESSION",
          message: "Invalid or unauthorized session token for this investigation.",
        },
      });
      return;
    }
    next(err);
  }
}

export async function saveNotesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { investigationId } = req.params;
    const sessionToken = req.sessionToken!;

    await investigationService.verifySession(investigationId, sessionToken);
    const updated = await investigationService.saveNotes(investigationId, req.body);
    res.json(updated);
  } catch (err: any) {
    if (err.message === "INVALID_SESSION") {
      res.status(403).json({
        error: {
          code: "INVALID_SESSION",
          message: "Invalid or unauthorized session token for this investigation.",
        },
      });
      return;
    }
    next(err);
  }
}

export async function submitAccusationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { investigationId } = req.params;
    const sessionToken = req.sessionToken!;
    const { suspectId, reasoning } = req.body;

    const outcome = await verdictService.submitAccusation(
      investigationId,
      sessionToken,
      suspectId,
      reasoning
    );

    res.json(outcome);
  } catch (err: any) {
    if (err.message === "INVALID_SESSION") {
      res.status(403).json({
        error: {
          code: "INVALID_SESSION",
          message: "Invalid or unauthorized session token for this investigation.",
        },
      });
      return;
    }
    next(err);
  }
}
