import { Router } from "express";
import {
  UpdateProgressInputSchema,
  SaveNotesInputSchema,
  AccusationInputSchema,
} from "@ai-mystery-room/shared";
import { requireSessionToken } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  getInvestigationHandler,
  updateProgressHandler,
  saveNotesHandler,
  submitAccusationHandler,
} from "../controllers/investigation.controller.js";

export const investigationRouter = Router();

// Apply session auth requirement to all investigation endpoints
investigationRouter.use(requireSessionToken);

// Get progress
investigationRouter.get("/:investigationId", getInvestigationHandler);

// Update progress (reviewed / bookmarked)
investigationRouter.patch(
  "/:investigationId/progress",
  validateBody(UpdateProgressInputSchema),
  updateProgressHandler
);

// Save notes
investigationRouter.put(
  "/:investigationId/notes",
  validateBody(SaveNotesInputSchema),
  saveNotesHandler
);

// Submit final accusation
investigationRouter.post(
  "/:investigationId/accusation",
  validateBody(AccusationInputSchema),
  submitAccusationHandler
);
