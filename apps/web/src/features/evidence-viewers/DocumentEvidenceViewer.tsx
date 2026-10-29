import React from "react";
import { FileText, Stamp, CheckCircle2 } from "lucide-react";
import { DocumentEvidenceContent } from "@ai-mystery-room/shared";

export const DocumentEvidenceViewer: React.FC<{ content: DocumentEvidenceContent }> = ({ content }) => {
  const metadata = content.metadata || {};
  const signatures = content.signaturesOrMarks || [];

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0c0e14]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{content.documentType || "Official Document"}</div>
            <p className="text-[11px] font-mono text-slate-400">
              EVIDENCE RECORD // CLASSIFIED LOG
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 rounded bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 text-[11px] font-mono text-amber-400">
          <Stamp className="h-3 w-3" />
          <span>VERIFIED ARCHIVE</span>
        </div>
      </div>

      {/* Document Sheet Layout */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
        <div className="rounded-xl border border-slate-700/80 bg-[#141822] p-5 sm:p-6 shadow-xl relative">
          {/* Official Letterhead */}
          <div className="border-b border-slate-700 pb-3 mb-4 text-center">
            <h4 className="font-mono text-xs sm:text-sm font-bold tracking-widest text-amber-400 uppercase">
              {content.officialHeader || "OFFICIAL INVESTIGATIVE RECORD"}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">OFFICIAL LOG REPOSITORY // SUBMITTED AS FORENSIC EXHIBIT</span>
          </div>

          {/* Body Text */}
          <div className="text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-900/40 p-4 rounded-lg border border-slate-800">
            {content.bodyText}
          </div>

          {/* Metadata Grid */}
          {Object.keys(metadata).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-2">
                Document Metadata &amp; Parameters
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">{key}:</span>
                    <span className="font-semibold text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          {signatures.length > 0 && (
            <div className="mt-5 pt-3 border-t border-dashed border-slate-700 flex flex-wrap gap-4 items-center justify-between text-xs font-mono text-slate-400">
              {signatures.map((sig, i) => (
                <div key={i} className="flex items-center space-x-1.5 text-amber-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
