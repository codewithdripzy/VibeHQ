"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Agent {
  _id: string;
  name: string;
  role: string;
  rank: string;
  status: string;
  currentScore?: number;
  team?: string;
}

export default function AgentsPage() {
  return (
    <EntityListPage<Agent>
      title="Agents"
      icon="lucide:bot"
      endpoint="agents"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:bot", color: "text-violet-400" },
        { label: "Working", value: items.filter((i) => i.status === "working").length, icon: "lucide:play", color: "text-emerald-400" },
        { label: "Idle", value: items.filter((i) => i.status === "idle").length, icon: "lucide:pause", color: "text-gray-400" },
        { label: "Avg Score", value: items.length > 0 ? `${Math.round(items.reduce((acc, i) => acc + (i.currentScore ?? 0), 0) / items.length)}%` : "N/A", icon: "lucide:bar-chart", color: "text-amber-400" },
      ]}
      renderItem={(agent) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-semibold shrink-0">
            {agent.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{agent.name}</p>
              <Badge status={agent.status} />
            </div>
            <p className="text-[10px] text-gray-500 capitalize mt-0.5">{agent.role?.replace(/_/g, " ")}</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span className="capitalize">{agent.rank}</span>
            {agent.currentScore !== undefined && <span>{agent.currentScore}%</span>}
          </div>
        </div>
      )}
    />
  );
}
