import axios from "axios";
import {
  CasePublic,
  SuspectPublic,
  EvidencePublic,
  InvestigationPublic,
  VerdictOutcome,
  CaseSettings,
} from "@ai-mystery-room/shared";
import { getActiveSession } from "./session.js";

const apiBase = (import.meta as any).env?.VITE_API_URL
  ? `${(import.meta as any).env.VITE_API_URL.replace(/\/+$/, "")}/api/v1`
  : "/api/v1";

const client = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject session token if available
client.interceptors.request.use((config) => {
  // If token is already passed, keep it
  if (config.headers["x-session-token"]) {
    return config;
  }

  // Check URL params for caseId or investigationId
  const active = getActiveSession();
  if (active?.sessionToken) {
    config.headers["x-session-token"] = active.sessionToken;
  }
  return config;
});

export const api = {
  // 1. Health
  checkHealth: async () => {
    const res = await client.get("/health");
    return res.data;
  },

  // 2. Cases
  createCase: async (scenario: string, settings: CaseSettings) => {
    const res = await client.post<{
      caseId: string;
      status: string;
      title: string;
      investigationId: string;
      sessionToken: string;
    }>("/cases", { scenario, settings });
    return res.data;
  },

  getCase: async (caseId: string) => {
    const res = await client.get<CasePublic>(`/cases/${caseId}`);
    return res.data;
  },

  getSuspects: async (caseId: string) => {
    const res = await client.get<SuspectPublic[]>(`/cases/${caseId}/suspects`);
    return res.data;
  },

  getEvidenceList: async (caseId: string, filters?: { type?: string; suspectId?: string }) => {
    const res = await client.get<EvidencePublic[]>(`/cases/${caseId}/evidence`, {
      params: filters,
    });
    return res.data;
  },

  getEvidenceDetail: async (caseId: string, evidenceId: string) => {
    const res = await client.get<EvidencePublic>(`/cases/${caseId}/evidence/${evidenceId}`);
    return res.data;
  },

  // 3. Investigation
  getInvestigation: async (investigationId: string, sessionToken?: string) => {
    const res = await client.get<InvestigationPublic>(`/investigations/${investigationId}`, {
      headers: sessionToken ? { "x-session-token": sessionToken } : undefined,
    });
    return res.data;
  },

  updateProgress: async (
    investigationId: string,
    progress: { reviewedEvidenceIds?: string[]; bookmarkedEvidenceIds?: string[] },
    sessionToken?: string
  ) => {
    const res = await client.patch<InvestigationPublic>(
      `/investigations/${investigationId}/progress`,
      progress,
      {
        headers: sessionToken ? { "x-session-token": sessionToken } : undefined,
      }
    );
    return res.data;
  },

  saveNotes: async (
    investigationId: string,
    notes: Array<{ evidenceId?: string; text: string }>,
    sessionToken?: string
  ) => {
    const res = await client.put<InvestigationPublic>(
      `/investigations/${investigationId}/notes`,
      { notes },
      {
        headers: sessionToken ? { "x-session-token": sessionToken } : undefined,
      }
    );
    return res.data;
  },

  // 4. Accusation
  submitAccusation: async (
    investigationId: string,
    suspectId: string,
    reasoning?: string,
    sessionToken?: string
  ) => {
    const res = await client.post<VerdictOutcome>(
      `/investigations/${investigationId}/accusation`,
      { suspectId, reasoning },
      {
        headers: sessionToken ? { "x-session-token": sessionToken } : undefined,
      }
    );
    return res.data;
  },
};
