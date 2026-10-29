import React from "react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { TimelineEvidenceContent } from "@ai-mystery-room/shared";

export const TimelineEvidenceViewer: React.FC<{ content: TimelineEvidenceContent }> = ({ content }) => {
  const events = content.events || [];

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0d1017]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Chronological Incident Reconstruction</div>
            <p className="text-[11px] font-mono text-slate-400">
              SYNTHESIZED LOGS &amp; WITNESS TIME MARKS
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400">{events.length} chronological markers</div>
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto">
        <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
          {events.map((ev, i) => (
            <div key={i} className="relative pl-6">
              {/* Timeline Node */}
              <div
                className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${
                  ev.confirmed
                    ? "bg-amber-500 border-slate-900 shadow-md shadow-amber-500/30"
                    : "bg-slate-700 border-slate-900"
                }`}
              />

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-sm font-bold text-amber-400">{ev.time}</span>
                  <span className="text-[10px] font-mono flex items-center space-x-1 text-slate-400">
                    {ev.confirmed ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">CONFIRMED</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-amber-400" />
                        <span>UNVERIFIED CLAIM</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{ev.event}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400">Source: {ev.source}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
