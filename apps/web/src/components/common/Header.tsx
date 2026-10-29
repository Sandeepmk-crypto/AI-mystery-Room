import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, FolderKey, Sparkles } from "lucide-react";
import { getActiveSession } from "../../lib/session.js";

export const Header: React.FC = () => {
  const location = useLocation();
  const activeSession = getActiveSession();
  const isInvestigating = location.pathname.includes("/investigate");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090b10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 group-hover:bg-amber-500/20">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-white text-lg">AI MYSTERY ROOM</span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-amber-400 border border-amber-500/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">
              DETERMINISTIC DETECTIVE INVESTIGATION
            </p>
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            Cases
          </Link>

          {activeSession && !isInvestigating && (
            <Link
              to={`/cases/${activeSession.caseId}/investigate`}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs font-mono font-medium text-slate-200 hover:border-amber-500/50 hover:text-amber-400 transition"
            >
              <FolderKey className="h-3.5 w-3.5 text-amber-400" />
              <span>Resume Active Case</span>
            </Link>
          )}

          <Link
            to="/create"
            className="flex items-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all duration-200 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create Mystery</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
