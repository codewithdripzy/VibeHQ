"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Idea {
  _id: string;
  title: string;
  status: string;
  category?: string;
  priority?: string;
  description?: string;
}

export default function IdeasPage() {
  return (
    <EntityListPage<Idea>
      title="Ideas"
      icon="lucide:lightbulb"
      endpoint="ideas"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:lightbulb", color: "text-amber-400" },
        { label: "Proposed", value: items.filter((i) => i.status === "proposed").length, icon: "lucide:plus-circle", color: "text-sky-400" },
        { label: "Approved", value: items.filter((i) => i.status === "approved").length, icon: "lucide:check-circle", color: "text-emerald-400" },
        { label: "Implemented", value: items.filter((i) => i.status === "implemented").length, icon: "lucide:rocket", color: "text-violet-400" },
      ]}
      renderItem={(idea) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{idea.title}</p>
              <Badge status={idea.status} />
              {idea.priority && <Badge status={idea.priority} />}
            </div>
            {idea.category && <p className="text-[10px] text-gray-500 capitalize mt-0.5">{idea.category}</p>}
          </div>
        </div>
      )}
    />
  );
}
