import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-[#07090d] py-8 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          <span>Fictional mystery entertainment. All scenarios, suspects, and evidence are entirely fictional.</span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <Lock className="h-3 w-3 text-slate-500" />
            <span>Predetermined Culprit Invariant Verified</span>
          </span>
          <span>•</span>
          <span>Powered by Gemini &amp; MERN</span>
        </div>
      </div>
    </footer>
  );
};
