export interface StoredSession {
  caseId: string;
  investigationId: string;
  sessionToken: string;
  savedAt: string;
}

const STORAGE_PREFIX = "aimystery_session_";

export function saveSession(caseId: string, investigationId: string, sessionToken: string): void {
  const sessionData: StoredSession = {
    caseId,
    investigationId,
    sessionToken,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(`${STORAGE_PREFIX}${caseId}`, JSON.stringify(sessionData));
  // Also store as active session
  localStorage.setItem("aimystery_active_session", JSON.stringify(sessionData));
}

export function getSession(caseId: string): StoredSession | null {
  const item = localStorage.getItem(`${STORAGE_PREFIX}${caseId}`);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function getActiveSession(): StoredSession | null {
  const item = localStorage.getItem("aimystery_active_session");
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function clearSession(caseId: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${caseId}`);
}
