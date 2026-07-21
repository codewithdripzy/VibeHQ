"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useCompany } from "../layout";
import entityService from "@/services/entity.service";
import { useToast } from "@/contexts/toast.context";

interface Resource {
  type: "document" | "file" | "image" | "link" | "code" | "data";
  name: string;
  url?: string;
  content?: string;
  mimeType?: string;
  size?: number;
  metadata?: any;
}

interface ChatMessage {
  team: string;
  sender: string;
  content: string;
  type: "message" | "delegation" | "response" | "system" | "typing";
  linkedDelegationTo?: string;
  typing?: boolean;
  resources?: Resource[];
  timestamp: string;
}

interface Project {
  _id: string;
  name: string;
  status: string;
}

interface Session {
  _id: string;
  uid: string;
  status: "running" | "paused" | "completed" | "failed" | "cancelled";
  phase: number;
  turnsUsed: number;
  maxTurns: number;
  chatLog: ChatMessage[];
  questions: any[];
  summary?: any;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  running: "text-emerald-400",
  paused: "text-amber-400",
  completed: "text-sky-400",
  failed: "text-red-400",
  cancelled: "text-gray-400",
};

const teamColors: Record<string, string> = {
  board: "bg-white/10 text-white",
  engineering: "bg-blue-500/10 text-blue-400",
  marketing: "bg-pink-500/10 text-pink-400",
  sales: "bg-emerald-500/10 text-emerald-400",
  finance: "bg-amber-500/10 text-amber-400",
  design: "bg-violet-500/10 text-violet-400",
  product: "bg-cyan-500/10 text-cyan-400",
  analytics: "bg-orange-500/10 text-orange-400",
  research: "bg-teal-500/10 text-teal-400",
  operations: "bg-gray-500/10 text-gray-400",
};

const teamIcons: Record<string, string> = {
  board: "lucide:crown",
  engineering: "lucide:code",
  marketing: "lucide:megaphone",
  sales: "lucide:trending-up",
  finance: "lucide:wallet",
  design: "lucide:palette",
  product: "lucide:box",
  analytics: "lucide:bar-chart",
  research: "lucide:search",
  operations: "lucide:settings",
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function ResourceCard({ resource }: { resource: Resource }) {
  const iconMap: Record<string, string> = {
    document: "lucide:file-text",
    file: "lucide:file",
    image: "lucide:image",
    link: "lucide:external-link",
    code: "lucide:code",
    data: "lucide:bar-chart",
  };
  const colorMap: Record<string, string> = {
    document: "text-sky-400 bg-sky-500/10",
    file: "text-amber-400 bg-amber-500/10",
    image: "text-pink-400 bg-pink-500/10",
    link: "text-violet-400 bg-violet-500/10",
    code: "text-emerald-400 bg-emerald-500/10",
    data: "text-orange-400 bg-orange-500/10",
  };
  const icon = iconMap[resource.type] || "lucide:paperclip";
  const color = colorMap[resource.type] || "text-gray-400 bg-gray-500/10";

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors ${resource.url ? "cursor-pointer" : ""}`}
      onClick={() => resource.url && window.open(resource.url, "_blank")}
    >
      <div className={`p-1 rounded ${color}`}>
        <Icon icon={icon} className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-gray-300 truncate">{resource.name}</p>
        <p className="text-[9px] text-gray-600 capitalize">{resource.type}</p>
      </div>
      {resource.url && (
        <Icon icon="lucide:external-link" className="w-2.5 h-2.5 text-gray-600" />
      )}
    </div>
  );
}

function ChatBubble({
  msg,
  onSwitchTab,
}: {
  msg: ChatMessage;
  onSwitchTab: (team: string) => void;
}) {
  const isDelegation = msg.type === "delegation";
  const isSystem = msg.type === "system";
  const isResponse = msg.type === "response";
  const isTyping = msg.type === "typing" && msg.typing;
  const isFounder = msg.sender === "Founder";
  const teamStyle = isFounder
    ? "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/20"
    : teamColors[msg.team] || teamColors.board;

  if (isTyping) {
    return (
      <div className="flex flex-col gap-1 opacity-60">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${teamStyle}`}>
            {msg.sender}
          </span>
        </div>
        <div className="ml-1 text-[11px] text-gray-400 italic flex items-center gap-1">
          <span>{msg.sender} is thinking</span>
          <span className="flex gap-0.5">
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${isSystem ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${teamStyle}`}>
          {msg.sender}
        </span>
        <span className="text-[9px] text-gray-600">{timeAgo(msg.timestamp)}</span>
        {isResponse && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
            response
          </span>
        )}
      </div>
      <div className="ml-1 text-[11px] text-gray-300 leading-relaxed whitespace-pre-wrap">
        {msg.content.split("\n").map((line, i) => {
          // Handle markdown-like bold
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <span key={i}>
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="text-white font-semibold">{part}</strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
              {i < msg.content.split("\n").length - 1 && <br />}
            </span>
          );
        })}
      </div>
      {/* Resources */}
      {msg.resources && msg.resources.length > 0 && (
        <div className="ml-1 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {msg.resources.map((res, i) => (
            <ResourceCard key={i} resource={res} />
          ))}
        </div>
      )}
      {isDelegation && msg.linkedDelegationTo && (
        <button
          onClick={() => onSwitchTab(msg.linkedDelegationTo!)}
          className="flex items-center gap-1.5 mt-1 px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-400 hover:bg-violet-500/20 transition-colors w-fit cursor-pointer"
        >
          <Icon icon="lucide:external-link" className="w-3 h-3" />
          Switch to {msg.linkedDelegationTo} tab
        </button>
      )}
    </div>
  );
}

function WarRoomDetail({ session, companyId }: { session: Session; companyId: string }) {
  const [activeTab, setActiveTab] = useState("board");
  const [showThinkingLogs, setShowThinkingLogs] = useState(false);
  const [chimeMessage, setChimeMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  // Extract unique teams from chatLog, preserving order, board first
  const teams = Array.from(new Set(session.chatLog.map((m) => m.team)));
  if (!teams.includes("board")) teams.unshift("board");
  // Sort: board first, then alphabetical
  teams.sort((a, b) => {
    if (a === "board") return -1;
    if (b === "board") return 1;
    return a.localeCompare(b);
  });

  const activeMessages = session.chatLog.filter((m) => m.team === activeTab);
  const messageCounts = teams.reduce(
    (acc, t) => {
      acc[t] = session.chatLog.filter((m) => m.team === t).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleSwitchTab = (team: string) => {
    if (teams.includes(team)) {
      setActiveTab(team);
    }
  };

  const handleChimeIn = async () => {
    if (!chimeMessage.trim() || sending) return;
    setSending(true);
    try {
      await entityService.create(`brainstorm/${session.uid}/message`, {
        message: chimeMessage.trim(),
        companyId,
      });
      // Optimistically add the message to chatLog
      session.chatLog.push({
        team: "board",
        sender: "Founder",
        content: chimeMessage.trim(),
        type: "message",
        timestamp: new Date().toISOString(),
      });
      setChimeMessage("");
      toast("Message sent to the board", "success");
    } catch {
      toast("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleNudge = async () => {
    try {
      await entityService.create(`brainstorm/${session.uid}/message`, {
        message: "⚠️ FOUNDER NUDGE: The conversation seems to be stalling. Please make concrete decisions and create tasks for any action items. Stop discussing and start executing.",
        companyId,
      });
      session.chatLog.push({
        team: "board",
        sender: "Founder",
        content: "⚠️ Nudge: Stop discussing and start executing. Create tasks.",
        type: "message",
        timestamp: new Date().toISOString(),
      });
      toast("Nudge sent — board will refocus", "success");
    } catch {
      toast("Failed to send nudge", "error");
    }
  };

  const isRunning = session.status === "running";

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto">
        {teams.map((team) => {
          const isActive = activeTab === team;
          const colorClass = teamColors[team] || teamColors.board;
          const icon = teamIcons[team] || "lucide:users";
          const count = messageCounts[team] || 0;
          return (
            <button
              key={team}
              onClick={() => setActiveTab(team)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? `${colorClass} ring-1 ring-white/10`
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Icon icon={icon} className="w-3 h-3" />
              <span className="capitalize">{team}</span>
              {count > 0 && (
                <span className="text-[8px] opacity-60 ml-0.5">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <Icon icon={teamIcons[activeTab] || "lucide:users"} className="w-8 h-8 mb-2" />
            <p className="text-[11px]">No messages in this team tab yet</p>
          </div>
        ) : (
          activeMessages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} onSwitchTab={handleSwitchTab} />
          ))
        )}
      </div>

      {/* Chime-in bar — only for running sessions on the board tab */}
      {isRunning && activeTab === "board" && (
        <div className="px-3 py-2 border-t border-white/5 bg-black/30">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={chimeMessage}
                onChange={(e) => setChimeMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChimeIn()}
                placeholder="Chime into the conversation..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                disabled={sending}
              />
            </div>
            <button
              onClick={handleChimeIn}
              disabled={!chimeMessage.trim() || sending}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Icon icon="lucide:send" className="w-3 h-3" />
              )}
              Send
            </button>
            <button
              onClick={handleNudge}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-medium transition-colors"
              title="Nudge the board to stop talking and start executing"
            >
              <Icon icon="lucide:pointer" className="w-3 h-3" />
              Nudge
            </button>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-600">
        <div className="flex items-center gap-3">
          <span>{activeMessages.length} messages in {activeTab}</span>
          <span>{session.chatLog.length} total across all teams</span>
        </div>
        <button
          onClick={() => setShowThinkingLogs(!showThinkingLogs)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Icon icon={showThinkingLogs ? "lucide:chevron-down" : "lucide:chevron-up"} className="w-3 h-3" />
          <span>Thinking Logs</span>
        </button>
      </div>

      {/* Thinking Logs Panel */}
      {showThinkingLogs && (
        <div className="border-t border-white/5 bg-black/50 max-h-48 overflow-y-auto">
          <div className="p-3 space-y-2">
            <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-2">Activity Log</div>
            {session.chatLog
              .filter((m) => m.type === "typing" || m.type === "system")
              .slice(-10)
              .reverse()
              .map((msg, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px]">
                  <span className="text-gray-600 shrink-0">{timeAgo(msg.timestamp)}</span>
                  <span className={`font-medium ${msg.type === "typing" ? "text-amber-400" : "text-gray-400"}`}>
                    {msg.sender}:
                  </span>
                  <span className="text-gray-500 truncate">{msg.content}</span>
                </div>
              ))}
            {session.chatLog.filter((m) => m.type === "typing" || m.type === "system").length === 0 && (
              <div className="text-[10px] text-gray-600 italic">No activity yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WarRoomPage() {
  const { id: companyId } = useParams<{ id: string }>();
  const { company } = useCompany();
  const { toast } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [starting, setStarting] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const res = await entityService.list<Session>("brainstorm-sessions", { companyId, limit: "20" });
      setSessions(res.data || []);
    } catch (err) {
      toast("Failed to load sessions", "error");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await entityService.list<Project>("projects", { companyId, limit: "50" });
      setProjects(res.data || []);
    } catch {
      // Non-fatal
    }
  }, [companyId]);

  useEffect(() => {
    loadSessions();
    loadProjects();
  }, [loadSessions, loadProjects]);

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

  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "in_progress");
  const hasActiveSessions = sessions.some((s) => s.status === "running" || s.status === "paused");
  const noProjects = activeProjects.length === 0;
  const noSessions = sessions.length === 0;

  const handleStartBrainstorm = async () => {
    setStarting(true);
    try {
      const res = await entityService.create<Session>("brainstorm", { companyId } as Record<string, unknown>);
      toast("Board meeting started — brainstorming initiated", "success");
      await loadSessions();
      if (res?.data) setSelectedSession(res.data);
    } catch (err) {
      toast("Failed to start brainstorm", "error");
    } finally {
      setStarting(false);
    }
  };

  // Auto-start prompt: no projects and no sessions
  const showAutoStartPrompt = !loading && noProjects && noSessions && !hasActiveSessions;

  const activeCount = sessions.filter((s) => s.status === "running").length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Session list sidebar */}
      <div className="w-72 shrink-0 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold flex items-center gap-2">
              <Icon icon="lucide:message-circle" className="w-4 h-4" />
              War Room
            </h1>
            {!hasActiveSessions && (
              <button
                onClick={handleStartBrainstorm}
                disabled={starting}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-[10px] font-medium transition-colors disabled:opacity-50"
              >
                {starting ? (
                  <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Icon icon="lucide:plus" className="w-3 h-3" />
                )}
                New
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {activeCount} active
            </span>
            <span>{completedCount} completed</span>
            {noProjects && (
              <span className="flex items-center gap-1 text-amber-400">
                <Icon icon="lucide:alert-triangle" className="w-2.5 h-2.5" />
                no projects
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <Icon icon="lucide:message-circle" className="w-8 h-8 mb-2" />
              <p className="text-[11px]">No meetings yet</p>
              <p className="text-[9px] text-gray-700 mt-1">Auto-created on company setup</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isSelected = selectedSession?.uid === session.uid;
              const statusColor = statusColors[session.status] || "text-gray-400";
              const teamCount = new Set(session.chatLog.map((m) => m.team)).size;
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
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor.replace("text-", "bg-")}`} />
                    <span className="text-[11px] font-medium flex-1 truncate">
                      Board Meeting
                    </span>
                    <span className="text-[9px] text-gray-600">{timeAgo(session.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[9px] text-gray-500">
                    <span className="capitalize">{session.status}</span>
                    <span>{session.chatLog.length} msgs</span>
                    <span>{teamCount} team{teamCount !== 1 ? "s" : ""}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {selectedSession ? (
          <WarRoomDetail session={selectedSession} companyId={companyId} />
        ) : showAutoStartPrompt ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Icon icon="lucide:brain" className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-2">No Active Projects</h2>
            <p className="text-[11px] text-gray-500 text-center max-w-sm mb-6">
              Your company has no active projects. The board should hold a brainstorming meeting to define strategy, explore opportunities, and decide what to build.
            </p>
            <button
              onClick={handleStartBrainstorm}
              disabled={starting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-medium text-white transition-colors disabled:opacity-50"
            >
              {starting ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Icon icon="lucide:play" className="w-3.5 h-3.5" />
              )}
              Start Board Meeting
            </button>
            <p className="text-[9px] text-gray-700 mt-3">
              This will kick off an autonomous brainstorm session with the board
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <Icon icon="lucide:message-circle" className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Select a meeting to view</p>
            <p className="text-[10px] text-gray-700 mt-1">
              {noProjects && !noSessions
                ? "No active projects — start a brainstorm to define what to build"
                : "The first meeting is auto-created when your company is set up"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
