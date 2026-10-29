import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Trophy,
  XCircle,
  ShieldCheck,
  FileText,
  Lightbulb,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { VerdictOutcome } from "@ai-mystery-room/shared";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.js";

export const VerdictPage: React.FC = () => {
  const location = useLocation();
  const [outcome, setOutcome] = useState<VerdictOutcome | null>(null);
  const [loading] = useState(false);

  useEffect(() => {
    // Check if passed in state from accusation submission
    const stateOutcome = (location.state as any)?.outcome as VerdictOutcome;
    if (stateOutcome) {
      setOutcome(stateOutcome);
    }
  }, [location.state]);

  if (loading) return <LoadingSpinner message="Retrieving verdict debrief..." />;
  if (!outcome) {
    return (
      <div className="min-h-screen bg-[#07090d] text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-[#0e131d] p-6 text-center space-y-4">
          <BookOpen className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Investigation Debrief</h2>
          <p className="text-xs text-slate-400 font-mono">
            No active verdict outcome in memory. You can resume your case or start a fresh investigation.
          </p>
          <div className="flex justify-center space-x-3 pt-2">
            <Link
              to="/"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-mono font-bold text-white transition"
            >
              Return Home
            </Link>
            <Link
              to="/create"
              className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-mono font-bold text-slate-950 transition"
            >
              Create New Case
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSolved = outcome.isCorrect;

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Verdict Banner */}
        <div
          className={`rounded-3xl border p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl ${
            isSolved
              ? "border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-[#0a1710] to-[#07090d]"
              : "border-red-500/50 bg-gradient-to-b from-red-950/40 via-[#180a0a] to-[#07090d]"
          }`}
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl shadow-xl">
            {isSolved ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                <Trophy className="h-10 w-10" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40">
                <XCircle className="h-10 w-10" />
              </div>
            )}
          </div>

          <span
            className={`inline-block font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${
              isSolved
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-red-500/10 text-red-300 border-red-500/30"
            }`}
          >
            {isSolved ? "OFFICIAL CONVICTION SECURED" : "MISCARRIAGE OF JUSTICE // INNOCENT ACCUSED"}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {isSolved ? "CASE SOLVED!" : "CASE UNSOLVED"}
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {isSolved
              ? `Outstanding deduction, Detective! You successfully synthesized the decisive forensic clues and unmasked ${outcome.solution.culprit.name}.`
              : `You formally accused ${outcome.selectedSuspect.name}, but the true perpetrator was ${outcome.solution.culprit.name}. Review the revelation below to see the hidden truth.`}
          </p>

          {/* Comparison Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left text-xs font-mono">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
              <span className="text-slate-400 block mb-1">YOUR ACCUSATION:</span>
              <span className={`text-sm font-bold ${isSolved ? "text-emerald-400" : "text-red-400"}`}>
                {outcome.selectedSuspect.name}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5">
              <span className="text-amber-400 block mb-1">ACTUAL PERPETRATOR:</span>
              <span className="text-sm font-bold text-white">{outcome.solution.culprit.name}</span>
            </div>
          </div>
        </div>

        {/* The Full Truth: Motive & Method */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            <FileText className="h-4 w-4" />
            <span>The Revelation: How the Incident Occurred</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="text-amber-400 font-bold uppercase block mb-1">TRUE HIDDEN MOTIVE</span>
              <p className="text-slate-200 leading-relaxed font-sans text-sm">
                {outcome.solution.motive}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="text-amber-400 font-bold uppercase block mb-1">EXECUTION METHOD</span>
              <p className="text-slate-200 leading-relaxed font-sans text-sm">
                {outcome.solution.method}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-slate-300 block mb-2 uppercase">
              Comprehensive Causal Breakdown:
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950 p-5 rounded-xl border border-slate-800">
              {outcome.solution.explanation}
            </p>
          </div>
        </div>

        {/* Decisive Clues and Red Herrings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Decisive Proof */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0a120e] p-6 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-950 pb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Decisive Evidence That Sealed Guilt</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              These recovered evidence items contained contradictions and forensic residue that conclusively connected the culprit to the incident:
            </p>
            <div className="space-y-2">
              {outcome.solution.decisiveEvidenceIds.map((id, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-xs font-mono text-emerald-300"
                >
                  Exhibited Key Artifact #{i + 1} [{id}]
                </div>
              ))}
            </div>
          </div>

          {/* Red Herrings Explained */}
          <div className="rounded-2xl border border-amber-500/30 bg-[#120e0a] p-6 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-amber-950 pb-2">
              <Lightbulb className="h-4 w-4" />
              <span>Red Herrings Demystified</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Why other suspicious individuals were exonerated by evidence:
            </p>
            <div className="space-y-2.5">
              {outcome.solution.redHerringExplanations.map((exp, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-slate-300 leading-relaxed"
                >
                  {exp}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-6 py-3.5 text-xs font-mono font-bold text-slate-200 transition"
          >
            <span>Return to Case Desk</span>
          </Link>

          <Link
            to="/create"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-8 py-3.5 text-xs font-mono font-bold text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>Launch Another Investigation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
