"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useCompany } from "../layout";
import entityService from "@/services/entity.service";
import { useToast } from "@/contexts/toast.context";

interface Delegation {
  to: string;
  question: string;
  status: "pending" | "in_progress" | "completed" | "timeout";
  response?: string;
  createdAt?: string;
}

interface Question {
  id: string;
  parentId?: string;
  phase: number;
  depth: number;
  question: string;
  status: "pending" | "researching" | "resolved" | "delegated" | "skipped";
  answer?: string;
  confidence: number;
  currentQuestionId?: string;
  sources: { title: string; url: string; snippet: string }[];
  delegation?: {
    to: string;
    status: string;
    response?: string;
  };
  createdAt: string;
  resolvedAt?: string;
}

interface Session {
  _id: string;
  uid: string;
  status: "running" | "paused" | "completed" | "failed" | "cancelled";
  phase: number;
  trigger: string;
  turnsUsed: number;
  maxTurns: number;
  questions: Question[];
  currentQuestionId?: string;
  delegations: Delegation[];
  summary?: {
    problemStatement?: string;
    proposedSolution?: string;
    targetMarket?: string;
    businessModel?: string;
    competitiveAdvantage?: string;
    mvpScope?: string;
    resourceRequirements?: string;
    riskAssessment?: string;
    recommendation?: string;
    nextSteps: string[];
  };
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  running: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "lucide:play" },
  paused: { color: "text-amber-400", bg: "bg-amber-500/10", icon: "lucide:pause" },
  completed: { color: "text-sky-400", bg: "bg-sky-500/10", icon: "lucide:check-circle" },
  failed: { color: "text-red-400", bg: "bg-red-500/10", icon: "lucide:x-circle" },
  cancelled: { color: "text-gray-400", bg: "bg-gray-500/10", icon: "lucide:x" },
  resolved: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "lucide:check" },
  pending: { color: "text-amber-400", bg: "bg-amber-500/10", icon: "lucide:clock" },
  researching: { color: "text-sky-400", bg: "bg-sky-500/10", icon: "lucide:search" },
  delegated: { color: "text-violet-400", bg: "bg-violet-500/10", icon: "lucide:send" },
  skipped: { color: "text-gray-400", bg: "bg-gray-500/10", icon: "lucide:skip-forward" },
};

const phaseLabels = [
  "",
  "Problem Discovery",
  "Market Research",
  "Solution Design",
  "Competitive Analysis",
  "Business Model",
  "Synthesis",
];

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function QuestionNode({
  question,
  allQuestions,
  isCurrent,
}: {
  question: Question;
  allQuestions: Question[];
  isCurrent: boolean;
}) {
  const children = allQuestions.filter((q) => q.parentId === question.id);
  const cfg = statusConfig[question.status] || statusConfig.pending;

  return (
    <div className={`ml-${question.depth > 0 ? "4" : "0"}`}>
      <div
        className={`flex items-start gap-2 p-2 rounded-lg mb-1 ${
          isCurrent ? "bg-white/5 ring-1 ring-white/10" : ""
        }`}
      >
        <div className={`mt-0.5 ${cfg.color}`}>
          <Icon icon={cfg.icon} className="w-3 h-3" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-300 leading-relaxed">{question.question}</p>
          {question.answer && (
            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{question.answer}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            {question.confidence > 0 && (
              <span className={`text-[9px] ${cfg.color}`}>{question.confidence}%</span>
            )}
            {question.delegation && (
              <span className="text-[9px] text-violet-400">
                → {question.delegation.to}
              </span>
            )}
            {question.sources.length > 0 && (
              <span className="text-[9px] text-gray-600">
                {question.sources.length} source{question.sources.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
      {children.map((child) => (
        <QuestionNode
          key={child.id}
          question={child}
          allQuestions={allQuestions}
          isCurrent={child.id === question.currentQuestionId}
        />
      ))}
    </div>
  );
}

function SessionDetail({ session }: { session: Session }) {
  const resolved = session.questions.filter((q) => q.status === "resolved").length;
  const pending = session.questions.filter((q) => q.status === "pending").length;
  const delegated = session.questions.filter((q) => q.status === "delegated").length;
  const rootQuestions = session.questions.filter((q) => !q.parentId);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-4 text-[10px] text-gray-500">
        <span>Phase {session.phase}/6 — {phaseLabels[session.phase]}</span>
        <span>Turn {session.turnsUsed}/{session.maxTurns}</span>
        <span>{resolved} resolved · {pending} pending · {delegated} delegated</span>
      </div>

      {/* Summary if completed */}
      {session.summary && session.summary.problemStatement && (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2">
          <h3 className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Icon icon="lucide:sparkles" className="w-3 h-3 text-amber-400" />
            Synthesis
          </h3>
          {session.summary.problemStatement && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Problem</p>
              <p className="text-[10px] text-gray-300">{session.summary.problemStatement}</p>
            </div>
          )}
          {session.summary.proposedSolution && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Solution</p>
              <p className="text-[10px] text-gray-300">{session.summary.proposedSolution}</p>
            </div>
          )}
          {session.summary.targetMarket && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Target Market</p>
              <p className="text-[10px] text-gray-300">{session.summary.targetMarket}</p>
            </div>
          )}
          {session.summary.businessModel && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Business Model</p>
              <p className="text-[10px] text-gray-300">{session.summary.businessModel}</p>
            </div>
          )}
          {session.summary.competitiveAdvantage && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Competitive Advantage</p>
              <p className="text-[10px] text-gray-300">{session.summary.competitiveAdvantage}</p>
            </div>
          )}
          {session.summary.mvpScope && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">MVP Scope</p>
              <p className="text-[10px] text-gray-300">{session.summary.mvpScope}</p>
            </div>
          )}
          {session.summary.riskAssessment && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Risk Assessment</p>
              <p className="text-[10px] text-gray-300">{session.summary.riskAssessment}</p>
            </div>
          )}
          {session.summary.nextSteps.length > 0 && (
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Next Steps</p>
              <ul className="space-y-0.5">
                {session.summary.nextSteps.map((step, i) => (
                  <li key={i} className="text-[10px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-gray-600 mt-px">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Question graph */}
      <div>
        <h3 className="text-[11px] font-semibold text-white mb-2 flex items-center gap-1.5">
          <Icon icon="lucide:git-branch" className="w-3 h-3" />
          Question Graph
        </h3>
        {rootQuestions.length === 0 ? (
          <p className="text-[10px] text-gray-600">No questions yet</p>
        ) : (
          <div className="space-y-1">
            {rootQuestions.map((q) => (
              <QuestionNode
                key={q.id}
                question={q}
                allQuestions={session.questions}
                isCurrent={q.id === session.currentQuestionId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delegations */}
      {session.delegations.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold text-white mb-2 flex items-center gap-1.5">
            <Icon icon="lucide:send" className="w-3 h-3" />
            Delegations
          </h3>
          <div className="space-y-1.5">
            {session.delegations.map((d, i) => {
              const cfg = statusConfig[d.status] || statusConfig.pending;
              return (
                <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium ${cfg.color}`}>{d.to}</span>
                    <Badge status={d.status} />
                    <span className="text-[9px] text-gray-600 ml-auto">{timeAgo(d.createdAt || "")}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{d.question}</p>
                  {d.response && (
                    <p className="text-[10px] text-gray-500 mt-1 italic">{d.response}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${cfg.bg} ${cfg.color}`}>
      <Icon icon={cfg.icon} className="w-2.5 h-2.5" />
      {status}
    </span>
  );
}

export default function BrainstormPage() {
  const { id: companyId } = useParams<{ id: string }>();
  const { company } = useCompany();
  const { toast } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const res = await entityService.list<Session>("brainstorm-sessions", { companyId, limit: "20" });
      setSessions(res.data || []);
    } catch (err) {
      toast("Failed to load brainstorm sessions", "error");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Poll active sessions
  useEffect(() => {
    const hasActive = sessions.some((s) => s.status === "running" || s.status === "paused");
    if (!hasActive) return;

    const interval = setInterval(() => {
      loadSessions();
      if (selectedSession && (selectedSession.status === "running" || selectedSession.status === "paused")) {
        entityService.list<Session>("brainstorm-sessions", { companyId, limit: "20" }).then((res) => {
          const updated = res.data?.find((s: Session) => s.uid === selectedSession.uid);
          if (updated) setSelectedSession(updated);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessions, selectedSession, companyId, loadSessions]);

  const handleStart = async () => {
    setStarting(true);
    try {
      await entityService.create("brainstorm", { companyId } as Record<string, unknown>);
      toast("Brainstorm session started", "success");
      await loadSessions();
    } catch (err) {
      toast("Failed to start brainstorm", "error");
    } finally {
      setStarting(false);
    }
  };

  const handleAction = async (uid: string, action: "pause" | "resume" | "cancel") => {
    try {
      await entityService.patchById("brainstorm", uid, {}, `/${action}`);
      toast(`Session ${action}d`, "success");
      await loadSessions();
      if (selectedSession?.uid === uid && action !== "pause") {
        setSelectedSession(null);
      }
    } catch (err) {
      toast(`Failed to ${action} session`, "error");
    }
  };

  const running = sessions.filter((s) => s.status === "running").length;
  const completed = sessions.filter((s) => s.status === "completed").length;

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Icon icon="lucide:brain" className="w-5 h-5" />
            Brainstorm
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Autonomous AI-powered idea generation and market research
          </p>
        </div>
        <button
          onClick={handleStart}
          disabled={starting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-medium transition-colors disabled:opacity-50"
        >
          {starting ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Icon icon="lucide:play" className="w-3 h-3" />
          )}
          Start Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Sessions", value: sessions.length, icon: "lucide:layers", color: "text-white" },
          { label: "Running", value: running, icon: "lucide:play", color: "text-emerald-400" },
          { label: "Completed", value: completed, icon: "lucide:check-circle", color: "text-sky-400" },
          { label: "Total Questions", value: sessions.reduce((a, s) => a + s.questions.length, 0), icon: "lucide:help-circle", color: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon={stat.icon} className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-[10px] text-gray-500">{stat.label}</span>
            </div>
            <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex gap-5 min-h-[400px]">
        {/* Session list */}
        <div className="w-72 shrink-0 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <Icon icon="lucide:brain" className="w-8 h-8 mb-2" />
              <p className="text-[11px]">No sessions yet</p>
            </div>
          ) : (
            sessions.map((session) => {
              const cfg = statusConfig[session.status];
              const isSelected = selectedSession?.uid === session.uid;
              return (
                <button
                  key={session.uid}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? "border-white/10 bg-white/5"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] ${cfg.color}`}>●</span>
                    <span className="text-[11px] font-medium flex-1 truncate">
                      Phase {session.phase} — {phaseLabels[session.phase]}
                    </span>
                    <span className="text-[9px] text-gray-600">{timeAgo(session.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge status={session.status} />
                    <span className="text-[9px] text-gray-600">
                      {session.questions.length}Q · {session.turnsUsed}/{session.maxTurns} turns
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          {selectedSession ? (
            <div className="space-y-3">
              {/* Controls */}
              {(selectedSession.status === "running" || selectedSession.status === "paused") && (
                <div className="flex items-center gap-2">
                  {selectedSession.status === "running" ? (
                    <button
                      onClick={() => handleAction(selectedSession.uid, "pause")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 text-[10px] text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      <Icon icon="lucide:pause" className="w-3 h-3" /> Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(selectedSession.uid, "resume")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 text-[10px] text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Icon icon="lucide:play" className="w-3 h-3" /> Resume
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(selectedSession.uid, "cancel")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 text-[10px] text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Icon icon="lucide:x" className="w-3 h-3" /> Cancel
                  </button>
                </div>
              )}

              <SessionDetail session={selectedSession} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <Icon icon="lucide:arrow-left" className="w-6 h-6 mb-2 rotate-90" />
              <p className="text-[11px]">Select a session to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
