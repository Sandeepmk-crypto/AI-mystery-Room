import React from "react";
import { UserCheck, Calendar, Quote, Shield } from "lucide-react";
import { WitnessEvidenceContent } from "@ai-mystery-room/shared";

export const WitnessStatementViewer: React.FC<{ content: WitnessEvidenceContent }> = ({ content }) => {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0d1017]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Witness: {content.witnessName}</div>
            <p className="text-[11px] font-mono text-slate-400">
              INTERVIEWER: {content.interviewer || "Investigating Officer"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>{content.statementDate}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
        {/* Transcript Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 relative shadow-inner">
          <Quote className="h-8 w-8 text-indigo-500/20 absolute top-4 left-4 -z-0" />
          <div className="relative z-10 text-sm text-slate-200 leading-relaxed font-sans italic whitespace-pre-wrap pl-4 border-l-2 border-indigo-500/50">
            "{content.transcript}"
          </div>
        </div>

        {/* Demeanor */}
        {content.demeanor && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs flex items-center justify-between">
            <span className="font-mono text-slate-400 flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span>DETECTIVE NOTES ON WITNESS DEMEANOR:</span>
            </span>
            <span className="font-mono font-semibold text-amber-300">{content.demeanor}</span>
          </div>
        )}
      </div>
    </div>
  );
};
