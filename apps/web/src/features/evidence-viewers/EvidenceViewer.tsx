import React from "react";
import { EvidencePublic } from "@ai-mystery-room/shared";
import { ChatEvidenceViewer } from "./ChatEvidenceViewer.js";
import { CCTVEvidenceViewer } from "./CCTVEvidenceViewer.js";
import { ImageEvidenceViewer } from "./ImageEvidenceViewer.js";
import { DocumentEvidenceViewer } from "./DocumentEvidenceViewer.js";
import { WitnessStatementViewer } from "./WitnessStatementViewer.js";
import { ForensicReportViewer } from "./ForensicReportViewer.js";
import { TimelineEvidenceViewer } from "./TimelineEvidenceViewer.js";
import { Bookmark, CheckCircle, Lightbulb, User } from "lucide-react";

interface EvidenceViewerProps {
  evidence: EvidencePublic;
  isBookmarked: boolean;
  isReviewed: boolean;
  suspectNameMap?: Record<string, string>;
  onToggleBookmark: () => void;
  onToggleReviewed: () => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  evidence,
  isBookmarked,
  isReviewed,
  suspectNameMap = {},
  onToggleBookmark,
  onToggleReviewed,
}) => {
  const renderViewer = () => {
    switch (evidence.type) {
      case "chat":
        return <ChatEvidenceViewer content={evidence.content as any} />;
      case "cctv":
        return <CCTVEvidenceViewer content={evidence.content as any} />;
      case "image":
        return <ImageEvidenceViewer content={evidence.content as any} />;
      case "document":
        return <DocumentEvidenceViewer content={evidence.content as any} />;
      case "witness_statement":
        return <WitnessStatementViewer content={evidence.content as any} />;
      case "forensic_report":
        return <ForensicReportViewer content={evidence.content as any} />;
      case "timeline":
        return <TimelineEvidenceViewer content={evidence.content as any} />;
      default:
        return (
          <div className="p-6 text-sm text-slate-300 font-mono">
            Unrecognized evidence format.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Evidence Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111622] border border-slate-800 rounded-xl p-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              [{evidence.type.replace("_", " ")}]
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">{evidence.title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{evidence.description}</p>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onToggleBookmark}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition border ${
              isBookmarked
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400" : ""}`} />
            <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>

          <button
            onClick={onToggleReviewed}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition border ${
              isReviewed
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
          >
            <CheckCircle className={`h-3.5 w-3.5 ${isReviewed ? "text-emerald-400" : ""}`} />
            <span>{isReviewed ? "Reviewed" : "Mark Reviewed"}</span>
          </button>
        </div>
      </div>

      {/* Primary Specific Evidence Viewer */}
      <div className="flex-1 min-h-[420px]">
        {renderViewer()}
      </div>

      {/* Connected Clues and Related Suspects Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Clues Card */}
        <div className="md:col-span-2 rounded-xl border border-slate-800/90 bg-[#10141e] p-3.5">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-400 mb-2">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>EXTRACTED FORENSIC CLUES ({evidence.clues.length})</span>
          </div>
          <div className="space-y-1.5">
            {evidence.clues.map((c, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 mt-0.5 ${
                    c.importance === "critical"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : c.importance === "important"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {c.importance}
                </span>
                <span className="text-slate-200 leading-relaxed">{c.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Suspects Card */}
        <div className="rounded-xl border border-slate-800/90 bg-[#10141e] p-3.5">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400 mb-2">
            <User className="h-3.5 w-3.5 text-amber-400" />
            <span>RELATED PERSONS OF INTEREST</span>
          </div>
          {evidence.relatedSuspectIds.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No direct suspects linked.</p>
          ) : (
            <div className="space-y-1.5">
              {evidence.relatedSuspectIds.map((id) => (
                <div key={id} className="rounded bg-slate-900/60 border border-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200">
                  {suspectNameMap[id] || "Suspect ID: " + id.slice(-6)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
