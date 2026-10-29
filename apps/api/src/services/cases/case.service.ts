import crypto from "crypto";
import mongoose from "mongoose";
import { CaseSettings, CasePublic, SuspectPublic, EvidencePublic } from "@ai-mystery-room/shared";
import { CaseModel, ICaseDocument } from "../../models/case.model.js";
import { SuspectModel } from "../../models/suspect.model.js";
import { EvidenceModel } from "../../models/evidence.model.js";
import { InvestigationModel } from "../../models/investigation.model.js";
import { geminiService } from "../ai/gemini.service.js";

export interface CreateCaseResult {
  caseId: string;
  status: string;
  title: string;
  investigationId: string;
  sessionToken: string;
}

export class CaseService {
  public async createCase(scenario: string, settings: CaseSettings): Promise<CreateCaseResult> {
    // 1. Generate canonical manifest (Gemini or Mock)
    const manifest = await geminiService.generateCase(scenario, settings);

    // 2. Create the case document
    const caseDoc = new CaseModel({
      title: manifest.case.title,
      scenario,
      settings,
      status: "ready",
      incident: manifest.case.incident,
      solution: manifest.solution,
      generation: {
        model: "gemini",
        promptVersion: "1.0.0",
        attemptCount: 1,
        generatedAt: new Date(),
      },
      suspectIds: [],
      evidenceIds: [],
    });
    await caseDoc.save();

    // 3. Persist Suspects and map manifest IDs to Mongo ObjectIds
    const suspectManifestMap = new Map<string, mongoose.Types.ObjectId>();
    const suspectDocs = [];

    for (const s of manifest.suspects) {
      const suspectDoc = new SuspectModel({
        caseId: caseDoc._id,
        manifestId: s.id,
        name: s.name,
        age: s.age,
        occupation: s.occupation,
        relationshipToIncident: s.relationshipToIncident,
        background: s.background,
        alibi: s.alibi,
        possibleMotive: s.possibleMotive,
      });
      await suspectDoc.save();
      suspectManifestMap.set(s.id, suspectDoc._id as mongoose.Types.ObjectId);
      suspectDocs.push(suspectDoc);
    }

    // 4. Persist Evidence and resolve relatedSuspectIds
    const evidenceDocs = [];
    for (const e of manifest.evidence) {
      const resolvedSuspectIds = (e.relatedSuspectIds || [])
        .map((mId) => suspectManifestMap.get(mId))
        .filter((id): id is mongoose.Types.ObjectId => Boolean(id));

      const evidenceDoc = new EvidenceModel({
        caseId: caseDoc._id,
        manifestId: e.id,
        title: e.title,
        type: e.type,
        description: e.description,
        source: e.source,
        timestamp: e.timestamp,
        relatedSuspectIds: resolvedSuspectIds,
        content: e.content,
        clues: e.clues,
        media: e.media || [],
        visibility: "public",
      });
      await evidenceDoc.save();
      evidenceDocs.push(evidenceDoc);
    }

    // 5. Update case with suspectIds and evidenceIds
    caseDoc.suspectIds = suspectDocs.map((s) => s._id as mongoose.Types.ObjectId);
    caseDoc.evidenceIds = evidenceDocs.map((e) => e._id as mongoose.Types.ObjectId);
    await caseDoc.save();

    // 6. Create initial investigation session
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const investigation = new InvestigationModel({
      caseId: caseDoc._id,
      sessionTokenHash: tokenHash,
      status: "active",
      reviewedEvidenceIds: [],
      bookmarkedEvidenceIds: [],
      notes: [],
    });
    await investigation.save();

    return {
      caseId: (caseDoc._id as mongoose.Types.ObjectId).toString(),
      status: caseDoc.status,
      title: caseDoc.title,
      investigationId: (investigation._id as mongoose.Types.ObjectId).toString(),
      sessionToken: rawToken,
    };
  }

  public async getPublicCase(caseId: string): Promise<CasePublic | null> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) return null;

    const caseDoc = await CaseModel.findById(caseId);
    if (!caseDoc || caseDoc.status !== "ready") return null;

    const suspects = await SuspectModel.find({ caseId: caseDoc._id });
    const evidenceList = await EvidenceModel.find({ caseId: caseDoc._id, visibility: "public" });

    // CRITICAL: Solution is NEVER leaked in public case data
    return {
      id: (caseDoc._id as mongoose.Types.ObjectId).toString(),
      title: caseDoc.title,
      scenario: caseDoc.scenario,
      status: caseDoc.status,
      settings: caseDoc.settings,
      incident: caseDoc.incident,
      suspects: suspects.map((s) => ({
        id: (s._id as mongoose.Types.ObjectId).toString(),
        caseId: caseId,
        manifestId: s.manifestId,
        name: s.name,
        age: s.age,
        occupation: s.occupation,
        relationshipToIncident: s.relationshipToIncident,
        background: s.background,
        alibi: s.alibi,
        possibleMotive: s.possibleMotive,
      })),
      evidenceSummary: evidenceList.map((e) => ({
        id: (e._id as mongoose.Types.ObjectId).toString(),
        title: e.title,
        type: e.type,
        description: e.description,
        source: e.source,
        timestamp: e.timestamp,
        clueCount: e.clues.length,
        relatedSuspectIds: e.relatedSuspectIds.map((id) => id.toString()),
      })),
      createdAt: caseDoc.createdAt.toISOString(),
    };
  }

  public async getSuspects(caseId: string): Promise<SuspectPublic[]> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) return [];
    const suspects = await SuspectModel.find({ caseId });
    return suspects.map((s) => ({
      id: (s._id as mongoose.Types.ObjectId).toString(),
      caseId,
      manifestId: s.manifestId,
      name: s.name,
      age: s.age,
      occupation: s.occupation,
      relationshipToIncident: s.relationshipToIncident,
      background: s.background,
      alibi: s.alibi,
      possibleMotive: s.possibleMotive,
    }));
  }

  public async getEvidenceList(
    caseId: string,
    filters?: { type?: string; suspectId?: string }
  ): Promise<EvidencePublic[]> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) return [];

    const query: any = { caseId, visibility: "public" };
    if (filters?.type) query.type = filters.type;
    if (filters?.suspectId && mongoose.Types.ObjectId.isValid(filters.suspectId)) {
      query.relatedSuspectIds = new mongoose.Types.ObjectId(filters.suspectId);
    }

    const items = await EvidenceModel.find(query);
    return items.map((e) => ({
      id: (e._id as mongoose.Types.ObjectId).toString(),
      caseId,
      manifestId: e.manifestId,
      title: e.title,
      type: e.type,
      description: e.description,
      source: e.source,
      timestamp: e.timestamp,
      relatedSuspectIds: e.relatedSuspectIds.map((id) => id.toString()),
      clues: e.clues,
      media: e.media,
      visibility: e.visibility,
      content: e.content as any,
    }));
  }

  public async getEvidenceDetail(caseId: string, evidenceId: string): Promise<EvidencePublic | null> {
    if (!mongoose.Types.ObjectId.isValid(caseId) || !mongoose.Types.ObjectId.isValid(evidenceId)) {
      return null;
    }

    const e = await EvidenceModel.findOne({ _id: evidenceId, caseId, visibility: "public" });
    if (!e) return null;

    return {
      id: (e._id as mongoose.Types.ObjectId).toString(),
      caseId,
      manifestId: e.manifestId,
      title: e.title,
      type: e.type,
      description: e.description,
      source: e.source,
      timestamp: e.timestamp,
      relatedSuspectIds: e.relatedSuspectIds.map((id) => id.toString()),
      clues: e.clues,
      media: e.media,
      visibility: e.visibility,
      content: e.content as any,
    };
  }
}

export const caseService = new CaseService();
