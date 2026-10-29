import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, AlertTriangle, Check, ArrowRight } from "lucide-react";
import { SuspectPublic } from "@ai-mystery-room/shared";
import { api } from "../../lib/api.js";

interface AccusationModalProps {
  investigationId: string;
  suspects: SuspectPublic[];
  sessionToken: string;
  onClose: () => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  investigationId,
  suspects,
  sessionToken,
  onClose,
}) => {
  const navigate = useNavigate();
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>("");
  const [reasoning, setReasoning] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setError("Please select the suspect you accuse.");
      return;
    }
    if (!confirmed) {
      setError("Please acknowledge that you only get ONE attempt.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const outcome = await api.submitAccusation(
        investigationId,
        selectedSuspectId,
        reasoning.trim(),
        sessionToken
      );

      navigate(`/investigations/${investigationId}/result`, {
        state: { outcome },
      });
    } catch (err: any) {
      console.error("Accusation failed:", err);
      setError(
        err.response?.data?.error?.message ||
          "Failed to submit accusation. The case may already be concluded."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="max-w-2xl w-full rounded-2xl border border-red-500/40 bg-[#0e121a] p-6 sm:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Official Accusation Protocol</h2>
              <p className="text-xs font-mono text-slate-400">
                FORMAL CRIMINAL CHARGES // PERMANENT SUBMISSION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm px-2.5 py-1 rounded bg-slate-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs font-mono text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Suspect Selector Cards */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Select the Single Perpetrator:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
              {suspects.map((s) => {
                const isSelected = s.id === selectedSuspectId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSuspectId(s.id)}
                    className={`rounded-xl p-3.5 border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-red-950/40 border-red-500 text-white shadow-lg"
                        : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{s.name}</span>
                        {isSelected && <Check className="h-4 w-4 text-red-400" />}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mb-2">{s.occupation}</p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 italic">
                      Alibi: {s.alibi}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Investigative Reasoning &amp; Decisive Proof (Optional):
            </label>
            <textarea
              rows={3}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain how the timeline, CCTV, and forensics prove this suspect's guilt..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>

          {/* Warning Confirmation Checkbox */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400">Irreversible Decision:</strong> Every case has exactly one intended culprit. You cannot alter or re-submit your accusation once registered.
              </p>
              <label className="flex items-center space-x-2 text-xs font-mono text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span>I confirm my deduction and wish to receive the final verdict.</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-mono font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Resume Review
            </button>

            <button
              type="submit"
              disabled={!selectedSuspectId || !confirmed || submitting}
              className="flex items-center space-x-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 text-xs font-mono font-bold text-white transition shadow-lg shadow-red-600/30 active:scale-95"
            >
              <span>{submitting ? "Evaluating Verdict..." : "Submit Final Accusation"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
