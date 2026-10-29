import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  FolderOpen,
  Bookmark,
  CheckCircle,
  FileEdit,
  Save,
  ShieldAlert,
  Search,
} from "lucide-react";
import {
  CasePublic,
  SuspectPublic,
  EvidencePublic,
  InvestigationPublic,
} from "@ai-mystery-room/shared";
import { api } from "../../lib/api.js";
import { getSession } from "../../lib/session.js";
import { EvidenceViewer } from "../evidence-viewers/EvidenceViewer.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.js";
import { AccusationModal } from "../accusation/AccusationModal.js";

export const InvestigationRoomPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  // State
  const [caseData, setCaseData] = useState<CasePublic | null>(null);
  const [suspects, setSuspects] = useState<SuspectPublic[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidencePublic[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectPublic | null>(null);

  // Investigation session state
  const [investigation, setInvestigation] = useState<InvestigationPublic | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [notesText, setNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Filters & Tabs
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showSuspectModal, setShowSuspectModal] = useState(false);
  const [showAccuseModal, setShowAccuseModal] = useState(false);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Session and Case Data
  useEffect(() => {
    if (!caseId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Check local session
        const stored = getSession(caseId);
        let token = stored?.sessionToken || null;
        setSessionToken(token);

        // 2. Fetch public case and evidence list
        const [cData, sList, eList] = await Promise.all([
          api.getCase(caseId),
          api.getSuspects(caseId),
          api.getEvidenceList(caseId),
        ]);

        setCaseData(cData);
        setSuspects(sList);
        setEvidenceList(eList);
        if (eList.length > 0) {
          setSelectedEvidenceId(eList[0].id);
        }

        // 3. If session exists, fetch investigation progress
        if (stored?.investigationId && token) {
          try {
            const inv = await api.getInvestigation(stored.investigationId, token);
            setInvestigation(inv);
            setReviewedIds(new Set(inv.reviewedEvidenceIds || []));
            setBookmarkedIds(new Set(inv.bookmarkedEvidenceIds || []));
            if (inv.notes && inv.notes.length > 0) {
              setNotesText(inv.notes[0].text);
            }

            // If already completed, prompt or redirect to result
            if (inv.status === "completed" && inv.accusation) {
              navigate(`/investigations/${inv.id}/result`, {
                state: { fromCompletedSession: true },
              });
            }
          } catch (invErr) {
            console.warn("Could not load session progress:", invErr);
          }
        }
      } catch (err: any) {
        console.error("Failed to load investigation room:", err);
        setError("Failed to load case evidence. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [caseId, navigate]);

  // Handle Bookmark Toggle
  const handleToggleBookmark = async (evidenceId: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(evidenceId)) {
      next.delete(evidenceId);
    } else {
      next.add(evidenceId);
    }
    setBookmarkedIds(next);

    const stored = getSession(caseId!);
    if (stored?.investigationId && sessionToken) {
      try {
        await api.updateProgress(
          stored.investigationId,
          { bookmarkedEvidenceIds: Array.from(next) },
          sessionToken
        );
      } catch (err) {
        console.warn("Failed to persist bookmark:", err);
      }
    }
  };

  // Handle Reviewed Toggle
  const handleToggleReviewed = async (evidenceId: string) => {
    const next = new Set(reviewedIds);
    if (next.has(evidenceId)) {
      next.delete(evidenceId);
    } else {
      next.add(evidenceId);
    }
    setReviewedIds(next);

    const stored = getSession(caseId!);
    if (stored?.investigationId && sessionToken) {
      try {
        await api.updateProgress(
          stored.investigationId,
          { reviewedEvidenceIds: Array.from(next) },
          sessionToken
        );
      } catch (err) {
        console.warn("Failed to persist reviewed status:", err);
      }
    }
  };

  // Handle Save Notes
  const handleSaveNotes = async () => {
    const stored = getSession(caseId!);
    if (!stored?.investigationId || !sessionToken) return;

    setIsSavingNotes(true);
    try {
      await api.saveNotes(
        stored.investigationId,
        [{ evidenceId: selectedEvidenceId || undefined, text: notesText }],
        sessionToken
      );
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    } catch (err) {
      console.warn("Failed to save notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (loading) return <LoadingSpinner message="Entering crime scene investigation workspace..." />;
  if (error || !caseData) {
    return <ErrorMessage message={error || "Case unavailable"} onRetry={() => window.location.reload()} />;
  }

  // Filter evidence
  const filteredEvidence = evidenceList.filter((e) => {
    if (typeFilter === "all") return true;
    if (typeFilter === "bookmarked") return bookmarkedIds.has(e.id);
    return e.type === typeFilter;
  });

  const selectedEvidence = evidenceList.find((e) => e.id === selectedEvidenceId) || evidenceList[0];

  // Suspect lookup dictionary for quick naming
  const suspectMap: Record<string, string> = {};
  suspects.forEach((s) => {
    suspectMap[s.id] = s.name;
  });

  const progressPercent = Math.round((reviewedIds.size / (evidenceList.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 flex flex-col">
      {/* Top Investigation Room Status Header */}
      <div className="border-b border-slate-800/80 bg-[#0c1017] px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {caseData.title}
                </h1>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                  {caseData.settings.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                LOC: {caseData.incident.location} • EVIDENCE FILE ACTIVE
              </p>
            </div>
          </div>

          {/* Quick Stats & Accusation Button */}
          <div className="flex items-center space-x-4 self-end md:self-auto">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                Reviewed: {reviewedIds.size}/{evidenceList.length} ({progressPercent}%)
              </span>
            </div>

            <button
              onClick={() => setShowAccuseModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg shadow-red-600/20 active:scale-95"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Make Final Accusation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Detective Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Suspects Lineup & Evidence List (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Suspects Lineup Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-4 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Users className="h-3.5 w-3.5" />
                <span>Suspect Lineup ({suspects.length})</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Click to inspect</span>
            </div>

            <div className="space-y-2">
              {suspects.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSuspect(s);
                    setShowSuspectModal(true);
                  }}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 p-2.5 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold border border-slate-700 group-hover:border-amber-400">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.occupation}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300">
                    Alibi ↗
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Category Filter Pills & List */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-4 flex-1 flex flex-col shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Evidence Vault</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {filteredEvidence.length} items
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { id: "all", label: "All" },
                { id: "chat", label: "Chats" },
                { id: "cctv", label: "CCTV" },
                { id: "forensic_report", label: "Forensics" },
                { id: "document", label: "Docs" },
                { id: "witness_statement", label: "Witness" },
                { id: "bookmarked", label: "★ Saved" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTypeFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                    typeFilter === f.id
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Evidence Scroll List */}
            <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1">
              {filteredEvidence.map((ev) => {
                const isSelected = ev.id === selectedEvidenceId;
                const isRev = reviewedIds.has(ev.id);
                const isBook = bookmarkedIds.has(ev.id);

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvidenceId(ev.id)}
                    className={`rounded-xl p-3 text-xs cursor-pointer transition border flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#141b27] border-amber-500/60 shadow-md"
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
                        [{ev.type.replace("_", " ")}]
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {isBook && <Bookmark className="h-3 w-3 fill-amber-400 text-amber-400" />}
                        {isRev && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                      </div>
                    </div>

                    <div className="font-bold text-white mb-1 leading-snug">{ev.title}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{ev.clues.length} Clues</span>
                      <span>{ev.source.split("(")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Selected Evidence Detail Viewer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {selectedEvidence ? (
            <EvidenceViewer
              evidence={selectedEvidence}
              isBookmarked={bookmarkedIds.has(selectedEvidence.id)}
              isReviewed={reviewedIds.has(selectedEvidence.id)}
              suspectNameMap={suspectMap}
              onToggleBookmark={() => handleToggleBookmark(selectedEvidence.id)}
              onToggleReviewed={() => handleToggleReviewed(selectedEvidence.id)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-slate-800 bg-[#0c1017] p-8 text-center">
              <Search className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-mono text-slate-400">Select an evidence artifact to inspect.</p>
            </div>
          )}
        </div>

        {/* Right Column: Detective Notebook & Notes (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-4 flex flex-col h-full shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <FileEdit className="h-3.5 w-3.5" />
                <span>Detective Notebook</span>
              </span>
              {noteSavedFeedback && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="h-2.5 w-2.5" />
                  <span>Saved</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-2">
              Record deductions, contradictions in alibis, and timeline anomalies:
            </p>

            <textarea
              rows={12}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Suspect #1 claims he was in the electrical room, but CAM-04 timestamp 21:43 shows him entering the vault..."
              className="w-full flex-1 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-mono resize-none"
            />

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400">Persisted in session</span>
              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="flex items-center space-x-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-mono font-bold text-slate-200 transition"
              >
                <Save className="h-3 w-3" />
                <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suspect Detail Modal */}
      {showSuspectModal && selectedSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full rounded-2xl border border-slate-700 bg-[#0e131d] p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  CONFIDENTIAL DOSSIER
                </span>
                <h3 className="text-lg font-bold text-white">{selectedSuspect.name}</h3>
              </div>
              <button
                onClick={() => setShowSuspectModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono block mb-0.5">OCCUPATION &amp; ROLE:</span>
                <span className="text-slate-200 font-semibold">{selectedSuspect.occupation}</span>
              </div>

              <div>
                <span className="text-slate-400 font-mono block mb-0.5">RELATIONSHIP TO INCIDENT:</span>
                <p className="text-slate-300 leading-relaxed">{selectedSuspect.relationshipToIncident}</p>
              </div>

              <div>
                <span className="text-slate-400 font-mono block mb-0.5">BACKGROUND:</span>
                <p className="text-slate-300 leading-relaxed">{selectedSuspect.background}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-amber-400 font-mono font-bold block mb-1">STATED ALIBI:</span>
                <p className="text-slate-200 italic leading-relaxed">"{selectedSuspect.alibi}"</p>
              </div>

              <div>
                <span className="text-slate-400 font-mono block mb-0.5">POSSIBLE MOTIVE:</span>
                <p className="text-slate-300 leading-relaxed">{selectedSuspect.possibleMotive}</p>
              </div>
            </div>

            <button
              onClick={() => setShowSuspectModal(false)}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-mono font-bold text-white transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

      {/* Accusation Modal */}
      {showAccuseModal && investigation && (
        <AccusationModal
          investigationId={investigation.id}
          suspects={suspects}
          sessionToken={sessionToken || ""}
          onClose={() => setShowAccuseModal(false)}
        />
      )}
    </div>
  );
};
