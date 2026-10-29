import { Request, Response, NextFunction } from "express";
import { caseService } from "../services/cases/case.service.js";

export async function createCaseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { scenario, settings } = req.body;
    const result = await caseService.createCase(scenario, settings);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCaseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { caseId } = req.params;
    const caseData = await caseService.getPublicCase(caseId);
    if (!caseData) {
      res.status(404).json({
        error: {
          code: "CASE_NOT_FOUND",
          message: `Case with ID '${caseId}' was not found.`,
        },
      });
      return;
    }
    res.json(caseData);
  } catch (err) {
    next(err);
  }
}

export async function getSuspectsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { caseId } = req.params;
    const suspects = await caseService.getSuspects(caseId);
    res.json(suspects);
  } catch (err) {
    next(err);
  }
}
