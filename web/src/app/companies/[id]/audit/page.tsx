"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface AuditEntry {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorType: string;
  timestamp: string;
  changes?: { field: string; oldValue: unknown; newValue: unknown }[];
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AuditPage() {
  return (
    <EntityListPage<AuditEntry>
      title="Audit Log"
      icon="lucide:scroll"
      endpoint="audit-logs"
      stats={(items) => [
        { label: "Total Events", value: items.length, icon: "lucide:scroll", color: "text-sky-400" },
        { label: "User Actions", value: items.filter((i) => i.actorType === "user").length, icon: "lucide:user", color: "text-violet-400" },
        { label: "Agent Actions", value: items.filter((i) => i.actorType === "agent").length, icon: "lucide:bot", color: "text-emerald-400" },
        { label: "System Actions", value: items.filter((i) => i.actorType === "system").length, icon: "lucide:settings", color: "text-gray-400" },
      ]}
      renderItem={(entry) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge status={entry.action} />
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 capitalize">{entry.entityType?.replace(/_/g, " ")}</span>
              <span className="text-[9px] text-gray-600 capitalize">{entry.actorType}</span>
            </div>
            {entry.changes && entry.changes.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {entry.changes.slice(0, 3).map((change, i) => (
                  <div key={i} className="text-[9px] text-gray-600">
                    <span className="text-gray-500">{change.field}:</span>{" "}
                    <span className="text-red-400/60 line-through">{String(change.oldValue)}</span>
                    {" → "}
                    <span className="text-emerald-400/60">{String(change.newValue)}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[9px] text-gray-600 mt-1">{timeAgo(entry.timestamp)}</p>
          </div>
        </div>
      )}
    />
  );
}
