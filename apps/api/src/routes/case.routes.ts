import { Router } from "express";
import { CreateCaseInputSchema } from "@ai-mystery-room/shared";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  createCaseHandler,
  getCaseHandler,
  getSuspectsHandler,
} from "../controllers/case.controller.js";
import {
  listEvidenceHandler,
  getEvidenceDetailHandler,
} from "../controllers/evidence.controller.js";

export const caseRouter = Router();

// Create Case
caseRouter.post("/", validateBody(CreateCaseInputSchema), createCaseHandler);

// Get Public Case
caseRouter.get("/:caseId", getCaseHandler);

// Suspects
caseRouter.get("/:caseId/suspects", getSuspectsHandler);

// Evidence
caseRouter.get("/:caseId/evidence", listEvidenceHandler);
caseRouter.get("/:caseId/evidence/:evidenceId", getEvidenceDetailHandler);
