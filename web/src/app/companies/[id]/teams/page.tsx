"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Team {
  _id: string;
  name: string;
  department: string;
  status: string;
  agents?: string[];
  metrics?: { tasksCompleted?: number; averageQualityScore?: number };
}

export default function TeamsPage() {
  return (
    <EntityListPage<Team>
      title="Teams"
      icon="lucide:users"
      endpoint="teams"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:users", color: "text-sky-400" },
        { label: "Active", value: items.filter((i) => i.status === "active").length, icon: "lucide:check-circle", color: "text-emerald-400" },
        { label: "Paused", value: items.filter((i) => i.status === "paused").length, icon: "lucide:pause", color: "text-yellow-400" },
        { label: "Total Agents", value: items.reduce((acc, i) => acc + (i.agents?.length ?? 0), 0), icon: "lucide:bot", color: "text-violet-400" },
      ]}
      renderItem={(team) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[11px] font-semibold shrink-0">
            {team.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{team.name}</p>
              <Badge status={team.status} />
            </div>
            <p className="text-[10px] text-gray-500 capitalize mt-0.5">{team.department}</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span>{team.agents?.length ?? 0} agents</span>
            {team.metrics?.tasksCompleted !== undefined && <span>{team.metrics.tasksCompleted} tasks</span>}
          </div>
        </div>
      )}
    />
  );
}
