import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { caseRouter } from "./case.routes.js";
import { investigationRouter } from "./investigation.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/cases", caseRouter);
apiRouter.use("/investigations", investigationRouter);
