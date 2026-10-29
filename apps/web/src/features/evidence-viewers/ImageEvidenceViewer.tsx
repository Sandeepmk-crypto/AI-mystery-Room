import React, { useState } from "react";
import { Camera, ZoomIn, Info, ShieldAlert } from "lucide-react";
import { ImageEvidenceContent } from "@ai-mystery-room/shared";

export const ImageEvidenceViewer: React.FC<{ content: ImageEvidenceContent }> = ({ content }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const annotations = content.annotations || [];

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{content.imageTitle || "Forensic Scene Photo"}</div>
            <p className="text-[11px] font-mono text-slate-400">
              SOURCE: {content.photographerOrSource || "Forensic Imaging Unit"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-mono text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition"
        >
          <ZoomIn className="h-3.5 w-3.5" />
          <span>{isZoomed ? "Standard View" : "Full Zoom"}</span>
        </button>
      </div>

      {/* Image Display */}
      <div className="p-4 space-y-4 overflow-y-auto">
        <div
          className={`relative rounded-xl overflow-hidden border border-slate-800 bg-black cursor-pointer transition-all duration-300 ${
            isZoomed ? "max-h-[600px]" : "max-h-[380px]"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={content.imageUrl || "/assets/crime_scene_pedestal.svg"}
            alt={content.imageTitle}
            className="w-full object-contain"
          />
        </div>

        {/* Caption */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-300 flex items-start space-x-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{content.caption}</p>
        </div>

        {/* Forensic Annotations */}
        {annotations.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-mono font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>FORENSIC ANNOTATIONS &amp; TAGGED AREAS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {annotations.map((ann, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-800/90 bg-slate-900/60 p-2.5 text-xs"
                >
                  <span className="font-mono font-bold text-amber-400 block mb-1">
                    [TAG {i + 1}] {ann.area}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{ann.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
