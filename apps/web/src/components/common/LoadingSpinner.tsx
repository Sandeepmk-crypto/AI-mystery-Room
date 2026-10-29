import React from "react";
import { Search } from "lucide-react";

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Loading case files...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <Search className="h-6 w-6 text-amber-500 animate-pulse" />
      </div>
      <p className="font-mono text-sm tracking-wide text-slate-300">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Reviewing forensic archives and suspect statements...</p>
    </div>
  );
};
