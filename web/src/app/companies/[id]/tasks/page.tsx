"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  project?: string;
  assignee?: string;
}

export default function TasksPage() {
  return (
    <EntityListPage<Task>
      title="Tasks"
      icon="lucide:check-square"
      endpoint="tasks"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:check-square", color: "text-amber-400" },
        { label: "In Progress", value: items.filter((i) => i.status === "in_progress").length, icon: "lucide:play", color: "text-violet-400" },
        { label: "Completed", value: items.filter((i) => i.status === "completed").length, icon: "lucide:check-circle", color: "text-emerald-400" },
        { label: "Blocked", value: items.filter((i) => i.status === "blocked").length, icon: "lucide:alert-circle", color: "text-red-400" },
      ]}
      renderItem={(task) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{task.title}</p>
              <Badge status={task.status} />
              <Badge status={task.priority} />
            </div>
          </div>
        </div>
      )}
    />
  );
}
