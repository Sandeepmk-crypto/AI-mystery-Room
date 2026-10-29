import React from "react";
import { Video, Clock, AlertTriangle, Eye, Shield } from "lucide-react";
import { CCTVEvidenceContent } from "@ai-mystery-room/shared";

export const CCTVEvidenceViewer: React.FC<{ content: CCTVEvidenceContent }> = ({ content }) => {
  const events = content.events || [];

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0a0f0d]">
      {/* CCTV Monitor Header */}
      <div className="flex items-center justify-between border-b border-emerald-950/80 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">{content.cameraName || "AUX CCTV FEED"}</span>
              <span className="flex items-center space-x-1 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                <span>REC PLAYBACK</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              LOC: {content.location} • WINDOW: {content.timeRange}
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 hidden sm:block">
          {content.quality || "720p Monochromatic Night-Vision"}
        </div>
      </div>

      {/* Monitor Display */}
      <div className="p-4 space-y-4 overflow-y-auto">
        <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-black shadow-2xl">
          <img
            src={content.stillFrameUrl || "/assets/cctv_sample.svg"}
            alt="CCTV Frame Capture"
            className="w-full object-cover max-h-[380px]"
          />
          <div className="absolute top-3 left-3 bg-black/70 border border-emerald-500/40 rounded px-2 py-1 text-[11px] font-mono text-emerald-400">
            FRAME RECONSTRUCTION
          </div>
        </div>

        {/* Scene Description & Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center space-x-1.5 font-mono font-semibold text-slate-300 mb-1">
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <span>SCENE OVERVIEW</span>
            </div>
            <p className="text-slate-400 leading-relaxed">{content.sceneDescription}</p>
          </div>

          {content.blindSpotsOrGaps && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3">
              <div className="flex items-center space-x-1.5 font-mono font-semibold text-amber-400 mb-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span>CAMERA BLIND SPOTS &amp; GAPS</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{content.blindSpotsOrGaps}</p>
            </div>
          )}
        </div>

        {/* Event Transcript Log */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
              TIMESTAMPED SURVEILLANCE EVENTS
            </span>
            <span className="text-[11px] font-mono text-slate-400">{events.length} motion triggers</span>
          </div>

          <div className="space-y-2.5">
            {events.map((ev, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-xs"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="flex items-center space-x-1 font-mono font-bold text-emerald-400 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{ev.time}</span>
                  </div>
                  <span className="text-slate-200">{ev.description}</span>
                </div>

                {ev.suspiciousFactor && (
                  <span className="inline-flex items-center space-x-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-mono text-amber-400 shrink-0">
                    <Shield className="h-3 w-3" />
                    <span>{ev.suspiciousFactor}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
