import React from "react";
import { FlaskConical, User, CheckCircle2, ShieldAlert } from "lucide-react";
import { ForensicEvidenceContent } from "@ai-mystery-room/shared";

export const ForensicReportViewer: React.FC<{ content: ForensicEvidenceContent }> = ({ content }) => {
  const findings = content.findings || [];

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0c1214]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <FlaskConical className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{content.labName || "Forensic Toxicology & Physical Unit"}</div>
            <p className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
              <User className="h-3 w-3 text-teal-400" />
              <span>EXAMINER: {content.examiner || "Lead Pathologist"}</span>
            </p>
          </div>
        </div>
        <div className="rounded bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-300">
          CHAIN OF CUSTODY VERIFIED
        </div>
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
        {/* Sample Analyzed */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs">
          <span className="font-mono text-slate-400 block mb-1 uppercase tracking-wider">
            Specimens / Substrates Submitted:
          </span>
          <span className="font-mono font-semibold text-slate-200">{content.sampleAnalyzed}</span>
        </div>

        {/* Forensic Findings */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block mb-3 border-b border-slate-800 pb-2">
            Physical &amp; Chemical Laboratory Findings
          </span>
          <div className="space-y-2.5">
            {findings.map((item, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-400 mb-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>PATHOLOGY &amp; BALLISTIC CONCLUSION</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono">
            {content.conclusion}
          </p>
        </div>
      </div>
    </div>
  );
};
