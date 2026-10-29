import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export const ErrorMessage: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = "Investigation Error", message, onRetry }) => {
  return (
    <div className="mx-auto my-8 max-w-xl rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300 font-mono mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
