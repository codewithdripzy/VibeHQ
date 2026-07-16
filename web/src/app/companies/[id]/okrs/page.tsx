"use client";

import EntityListPage, { Badge, ProgressBar } from "@/components/entity-list-page";

interface OKR {
  _id: string;
  title: string;
  description?: string;
  status: string;
  cadence?: string;
  progress?: number;
  keyResults?: { title: string; progress: number; status: string }[];
}

export default function OKRsPage() {
  return (
    <EntityListPage<OKR>
      title="OKRs"
      icon="lucide:target"
      endpoint="okrs"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:target", color: "text-violet-400" },
        { label: "Active", value: items.filter((i) => i.status === "active").length, icon: "lucide:play", color: "text-emerald-400" },
        { label: "Achieved", value: items.filter((i) => i.status === "achieved").length, icon: "lucide:trophy", color: "text-amber-400" },
        { label: "Avg Progress", value: items.length > 0 ? `${Math.round(items.reduce((a, i) => a + (i.progress ?? 0), 0) / items.length)}%` : "N/A", icon: "lucide:trending-up", color: "text-sky-400" },
      ]}
      renderItem={(okr) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{okr.title}</p>
              <Badge status={okr.status} />
              {okr.cadence && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 capitalize">{okr.cadence}</span>}
            </div>
            {okr.progress !== undefined && (
              <div className="flex items-center gap-3 mt-1.5">
                <ProgressBar value={okr.progress} max={100} />
                <span className="text-[9px] text-gray-500 shrink-0">{okr.progress}%</span>
              </div>
            )}
            {okr.keyResults && okr.keyResults.length > 0 && (
              <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-500">
                <span>{okr.keyResults.length} key results</span>
                <span>{okr.keyResults.filter((kr) => kr.status === "completed").length} achieved</span>
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}
