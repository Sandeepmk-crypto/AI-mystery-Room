import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Video,
  MessageSquare,
  FileSearch,
  Lock,
  ChevronRight,
  Flame,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickStart = (scenario: string, genre: string, difficulty: "easy" | "medium" | "hard") => {
    navigate("/create", {
      state: { presetScenario: scenario, presetGenre: genre, presetDifficulty: difficulty },
    });
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800/80">
        {/* Atmospheric Glow Backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-400 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-POWERED INTERACTIVE INVESTIGATION ROOM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Step Into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Crime Scene.</span><br />
            Unmask the Intended Culprit.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-sans">
            Submit any premise or story. Google Gemini architects a complete, internally consistent, 100% solvable fictional investigation with suspects, WhatsApp logs, CCTV records, and forensic autopsy reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 px-8 py-4 text-sm font-bold text-slate-950 transition-all duration-200 shadow-xl shadow-amber-500/20 active:scale-95"
            >
              <Search className="h-4 w-4" />
              <span>Create Your Mystery Case</span>
            </Link>

            <button
              onClick={() =>
                handleQuickStart(
                  "During an elite private gala at The Blackwood Estate, Lord Alistair Vance collapsed from digitalis toxicity while the priceless 'Midnight Sovereign' blue diamond vanished from its locked display pedestal during a 20-minute power outage.",
                  "Classic Detective Mystery",
                  "medium"
                )
              }
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 px-6 py-4 text-sm font-semibold text-slate-200 transition active:scale-95"
            >
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Launch Demo Case</span>
            </button>
          </div>

          {/* Core Product Principle Banner */}
          <div className="mt-14 inline-flex items-center space-x-3 rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-2.5 text-xs font-mono text-slate-400">
            <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              <strong className="text-slate-200">The Solvability Invariant:</strong> The intended culprit, timeline, and decisive clues are locked BEFORE you begin investigating. No shifting answers.
            </span>
          </div>
        </div>
      </section>

      {/* Preset Mystery Scenarios Section */}
      <section className="py-16 bg-[#0a0d14] border-b border-slate-800/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                SAMPLE INVESTIGATION PRESETS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Choose a Premise or Craft Your Own
              </h2>
            </div>
            <Link
              to="/create"
              className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>Custom Case Builder</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-slate-800 bg-[#0e131d] p-6 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-mono font-bold text-amber-400 border border-amber-500/20">
                    DIAMOND HEIST
                  </span>
                  <span className="text-xs font-mono text-slate-400">Medium</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition mb-2">
                  The Midnight Sovereign Heist
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  During an elite private gala at Blackwood Estate, Lord Vance collapses from digitalis toxicity while the priceless Midnight Sovereign blue diamond vanishes during a power surge.
                </p>
              </div>
              <button
                onClick={() =>
                  handleQuickStart(
                    "During an elite private gala at The Blackwood Estate, Lord Alistair Vance collapsed from digitalis toxicity while the priceless 'Midnight Sovereign' blue diamond vanished from its locked display pedestal during a 20-minute power outage.",
                    "Classic Detective Mystery",
                    "medium"
                  )
                }
                className="mt-6 flex items-center justify-center space-x-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 p-2.5 text-xs font-mono font-bold text-slate-200 transition"
              >
                <span>Investigate Case</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-slate-800 bg-[#0e131d] p-6 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-[11px] font-mono font-bold text-cyan-400 border border-cyan-500/20">
                    CYBER SABOTAGE
                  </span>
                  <span className="text-xs font-mono text-slate-400">Hard</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition mb-2">
                  The Quantum Key Sabotage
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  Inside a subterranean tech lab in Zurich, an impenetrable quantum encryption core is purged 30 minutes before IPO announcement, with only 4 engineers badged into the cleanroom.
                </p>
              </div>
              <button
                onClick={() =>
                  handleQuickStart(
                    "Inside a subterranean Zurich research facility, an ultra-secure quantum encryption core was purged exactly 30 minutes before a 10-billion-dollar acquisition announcement. Four engineers and the facility director were locked inside the cleanroom.",
                    "Corporate Intrigue",
                    "hard"
                  )
                }
                className="mt-6 flex items-center justify-center space-x-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 p-2.5 text-xs font-mono font-bold text-slate-200 transition"
              >
                <span>Investigate Case</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-slate-800 bg-[#0e131d] p-6 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-md bg-rose-500/10 px-2 py-1 text-[11px] font-mono font-bold text-rose-400 border border-rose-500/20">
                    LOCKED ROOM
                  </span>
                  <span className="text-xs font-mono text-slate-400">Medium</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition mb-2">
                  The Snowbound Chalet Mystery
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  Cut off by an Alpine blizzard in Aspen, a prominent venture capitalist is found deceased in his bolted study with an unburned fireplace and zero footprints in the snow outside.
                </p>
              </div>
              <button
                onClick={() =>
                  handleQuickStart(
                    "An avalanche traps five high-profile guests in a remote Aspen chalet. The host is discovered lifeless in his second-floor study, bolted securely from the inside with no footprints in the snow outside his balcony window.",
                    "Locked-Room Mystery",
                    "medium"
                  )
                }
                className="mt-6 flex items-center justify-center space-x-2 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-slate-950 p-2.5 text-xs font-mono font-bold text-slate-200 transition"
              >
                <span>Investigate Case</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Investigation Features & Mechanics */}
      <section className="py-20 bg-[#07090d]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              IMMERSIVE DETECTIVE WORKSPACE
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Everything You Need to Piece Together the Truth
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              No guesswork or arbitrary AI hallucinations. Every clue has a logical explanation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1017] p-6 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Chat Forensics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect subpoenaed WhatsApp logs and encrypted messages. Catch alibi contradictions and secret plans in time-stamped bubbles.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1017] p-6 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <Video className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">CCTV Feeds</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review backup security DVR camera feeds, still-frame reconstructions, and motion trigger transcripts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1017] p-6 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                <FileSearch className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Lab &amp; Crime Scenes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Examine toxicology lab results, glove monograms, digital logs, access logs, and witness statements.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1017] p-6 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">One Final Accusation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-attempt culprit accusation. Server determines correctness against hidden ground truth and reveals the full breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
