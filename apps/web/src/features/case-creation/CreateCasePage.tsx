import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Difficulty, CaseLength, CaseSettings } from "@ai-mystery-room/shared";
import { api } from "../../lib/api.js";
import { saveSession } from "../../lib/session.js";

const GENRES = [
  "Classic Detective Mystery",
  "Murder Mystery",
  "Diamond / Art Heist",
  "Corporate Intrigue & Sabotage",
  "Cyber Crime & Data Breach",
  "Locked-Room Enigma",
  "Psychological Thriller",
];

const PRESETS = [
  {
    title: "The Manor Poisoning",
    scenario:
      "During an elite private gala at The Blackwood Estate, Lord Alistair Vance collapsed from digitalis toxicity while the priceless 'Midnight Sovereign' blue diamond vanished from its locked display pedestal during a 20-minute power outage.",
    genre: "Classic Detective Mystery",
    difficulty: "medium" as Difficulty,
  },
  {
    title: "Quantum Server Sabotage",
    scenario:
      "Inside a subterranean Zurich research facility, an ultra-secure quantum encryption core was purged exactly 30 minutes before a 10-billion-dollar acquisition announcement. Four engineers and the facility director were locked inside the cleanroom.",
    genre: "Corporate Intrigue & Sabotage",
    difficulty: "hard" as Difficulty,
  },
  {
    title: "The Yacht Club Disappearance",
    scenario:
      "A renowned shipping magnate vanished from his luxury yacht anchored off Monaco during an evening fireworks regatta. The cabin door was locked from the inside, and his safe was cleaned out with no signs of forced entry.",
    genre: "Locked-Room Enigma",
    difficulty: "medium" as Difficulty,
  },
];

export const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scenario, setScenario] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [genre, setGenre] = useState("Classic Detective Mystery");
  const [length, setLength] = useState<CaseLength>("standard");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-populate if passed from preset
  useEffect(() => {
    const state = location.state as any;
    if (state?.presetScenario) setScenario(state.presetScenario);
    if (state?.presetGenre) setGenre(state.presetGenre);
    if (state?.presetDifficulty) setDifficulty(state.presetDifficulty);
  }, [location.state]);

  const generationSteps = [
    "Analyzing narrative premise and constraints...",
    "Selecting exactly one intended culprit and hidden motive...",
    "Engineering consistent timeline, chat logs & CCTV evidence...",
    "Planting decisive forensic clues and explainable red herrings...",
    "Executing deterministic solvability verification...",
    "Sealing investigation file for detective entry...",
  ];

  useEffect(() => {
    let timer: any;
    if (isSubmitting) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scenario.trim().length < 10) {
      setErrorMessage("Please provide a premise of at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setCurrentStepIndex(0);

    try {
      const settings: CaseSettings = { difficulty, genre, length };
      const data = await api.createCase(scenario.trim(), settings);

      // Persist session
      saveSession(data.caseId, data.investigationId, data.sessionToken);

      // Navigate to case briefing
      navigate(`/cases/${data.caseId}`);
    } catch (err: any) {
      console.error("Failed to generate case:", err);
      const msg = err.response?.data?.error?.message || "Failed to generate mystery. Please try again.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-bold text-amber-400 border border-amber-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CASE ARCHITECT STUDIO</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create a New Investigation</h1>
          <p className="text-sm text-slate-400 mt-1">
            Provide a mystery premise. The AI will engineer a complete, 100% solvable fictional investigation.
          </p>
        </div>

        {/* Form or Loading Overlay */}
        {isSubmitting ? (
          <div className="rounded-2xl border border-amber-500/30 bg-[#0f1420] p-8 sm:p-12 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generating Solvable Mystery</h3>
            <p className="text-xs font-mono text-slate-400 mb-8 max-w-md mx-auto">
              Please wait while Google Gemini and our consistency engine build and seal the case.
            </p>

            {/* Stepper Display */}
            <div className="max-w-md mx-auto space-y-3 text-left">
              {generationSteps.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 text-xs font-mono transition-opacity duration-300 ${
                      isPassed
                        ? "text-emerald-400"
                        : isCurrent
                        ? "text-amber-400 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isPassed
                          ? "bg-emerald-400"
                          : isCurrent
                          ? "bg-amber-400 animate-ping"
                          : "bg-slate-700"
                      }`}
                    />
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="flex items-center space-x-2 rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs font-mono text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Premise Presets */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span>Need Inspiration? Choose a Preset:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setScenario(p.scenario);
                      setGenre(p.genre);
                      setDifficulty(p.difficulty);
                    }}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-left hover:border-amber-500/40 hover:bg-slate-900 transition"
                  >
                    <div className="text-xs font-bold text-white mb-1">{p.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.genre}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Input */}
            <div className="rounded-2xl border border-slate-800 bg-[#0e131d] p-6 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="scenario" className="text-sm font-bold text-white flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <span>Mystery Scenario / Story Premise</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {scenario.length} / 3000 chars
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Describe the crime or suspicious incident. You can include specific fictional victims, stolen artifacts, or peculiar circumstances.
              </p>
              <textarea
                id="scenario"
                rows={5}
                required
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g. During the annual gala at The Blackwood Estate, the host collapsed after drinking a glass of vintage wine, and a rare emerald necklace vanished from his safe..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-slate-100 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Investigation Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Difficulty */}
              <div className="rounded-2xl border border-slate-800 bg-[#0e131d] p-4">
                <label className="text-xs font-mono font-bold text-slate-300 block mb-2 flex items-center space-x-1">
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  <span>DIFFICULTY</span>
                </label>
                <div className="space-y-1.5">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs font-mono capitalize transition border ${
                        difficulty === d
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="rounded-2xl border border-slate-800 bg-[#0e131d] p-4">
                <label className="text-xs font-mono font-bold text-slate-300 block mb-2 flex items-center space-x-1">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                  <span>GENRE</span>
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">
                  Shapes tone, narrative atmosphere, and evidence vocabulary.
                </p>
              </div>

              {/* Length */}
              <div className="rounded-2xl border border-slate-800 bg-[#0e131d] p-4">
                <label className="text-xs font-mono font-bold text-slate-300 block mb-2 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>INVESTIGATION SCOPE</span>
                </label>
                <div className="space-y-1.5">
                  {(
                    [
                      { key: "short", label: "Short (5-7 clues)" },
                      { key: "standard", label: "Standard (8-12 clues)" },
                      { key: "extended", label: "Extended (13-18 clues)" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setLength(item.key)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs font-mono transition border ${
                        length === item.key
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={scenario.trim().length < 10}
              className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed py-4 text-sm font-bold text-slate-950 transition-all duration-200 shadow-xl shadow-amber-500/10 active:scale-95"
            >
              <span>Engineer Mystery Case</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
