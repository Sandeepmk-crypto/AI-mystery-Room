import React from "react";
import { MessageSquare, Clock, User, ShieldAlert } from "lucide-react";
import { ChatEvidenceContent } from "@ai-mystery-room/shared";

export const ChatEvidenceViewer: React.FC<{ content: ChatEvidenceContent }> = ({ content }) => {
  const participants = content.participants || [];
  const messages = content.messages || [];

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0c1017]">
      {/* Messaging Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/70 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {participants.map((p) => p.displayName).join(", ") || "Encrypted Chat Channel"}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SUBPOENAED SECURE MESSAGING LOG</span>
            </div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          {messages.length} messages recovered
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isSender0 = participants[0] && msg.senderId === participants[0].suspectId;
          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isSender0 ? "items-start" : "items-end"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.isKeyClue
                    ? "bg-amber-950/40 border-2 border-amber-500/60 text-amber-100"
                    : isSender0
                    ? "bg-slate-800/90 border border-slate-700/60 text-slate-100"
                    : "bg-emerald-950/40 border border-emerald-800/50 text-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 text-[11px] font-mono">
                  <span className="font-bold text-amber-400/90 flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{msg.senderName}</span>
                  </span>
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{msg.timestamp}</span>
                  </span>
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {msg.isKeyClue && (
                  <div className="mt-2 pt-2 border-t border-amber-500/30 flex items-center space-x-1.5 text-[11px] font-mono text-amber-400">
                    <ShieldAlert className="h-3 w-3" />
                    <span>POTENTIAL INVESTIGATIVE CONTRADICTION / CLUE</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
