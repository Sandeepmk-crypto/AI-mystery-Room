import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  MapPin,
  Clock,
  Calendar,
  Users,
  Search,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { CasePublic } from "@ai-mystery-room/shared";
import { api } from "../../lib/api.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.js";

export const CaseBriefingPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<CasePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const fetchCase = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getCase(caseId);
        setCaseData(data);
      } catch (err: any) {
        console.error("Failed to load case briefing:", err);
        setError("Could not locate case file. It may be missing or uninitialized.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  if (loading) return <LoadingSpinner message="Accessing police case records..." />;
  if (error || !caseData) {
    return (
      <ErrorMessage
        message={error || "Case not found"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Classification Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0e131d] p-6 shadow-xl relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-red-400 border border-red-500/30">
                CONFIDENTIAL // LAW ENFORCEMENT ONLY
              </span>
              <span className="text-xs font-mono text-slate-400">
                CASE REF #{caseData.id.slice(-8).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {caseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>{caseData.incident.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                <span>{caseData.incident.date || "Night of Incident"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>{caseData.incident.time || "Approx. 21:30"}</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/cases/${caseData.id}/investigate`)}
            className="flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition shadow-lg shadow-amber-500/10 active:scale-95 shrink-0"
          >
            <span>Enter Investigation Room</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Incident Overview Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-6 shadow-md">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
            <FileText className="h-4 w-4" />
            <span>Incident Summary &amp; Initial Report</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {caseData.incident.summary}
          </p>
        </div>

        {/* Suspects Lineup Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>Suspects &amp; Persons of Interest ({caseData.suspects.length})</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Exactly 1 is the intended culprit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseData.suspects.map((s, index) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-800 bg-[#0e131d] p-4 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      SUSPECT #{index + 1}
                    </span>
                    {s.age && (
                      <span className="text-[11px] font-mono text-slate-400">Age: {s.age}</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{s.name}</h4>
                  <p className="text-xs text-amber-200/80 font-mono mb-2">{s.occupation}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {s.relationshipToIncident}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="text-slate-400 font-semibold">Alibi: </span>
                  <span className="italic">{s.alibi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Dossier Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <FolderOpen className="h-4 w-4 text-amber-400" />
              <span>Recovered Evidence Vault ({caseData.evidenceSummary.length} Artifacts)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Inspect inside room</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {caseData.evidenceSummary.map((ev) => (
              <div
                key={ev.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 text-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block mb-1">
                    [{ev.type.replace("_", " ")}]
                  </span>
                  <div className="font-bold text-white mb-1 leading-snug">{ev.title}</div>
                  <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{ev.clueCount} Clues</span>
                  <span>{ev.timestamp ? ev.timestamp.slice(11, 16) : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate(`/cases/${caseData.id}/investigate`)}
            className="flex items-center space-x-2 rounded-2xl bg-amber-500 hover:bg-amber-400 px-8 py-4 text-sm font-bold text-slate-950 transition shadow-xl shadow-amber-500/10 active:scale-95"
          >
            <Search className="h-4 w-4" />
            <span>Launch Detective Investigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
