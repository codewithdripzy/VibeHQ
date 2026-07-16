"use client";

import EntityListPage, { Badge, ProgressBar } from "@/components/entity-list-page";

interface Project {
  _id: string;
  name: string;
  status: string;
  priority?: string;
  progress?: number;
  tasksTotal?: number;
  tasksCompleted?: number;
  tasksInProgress?: number;
  tasksBlocked?: number;
  budget?: number;
  budgetUsed?: number;
  deadline?: string;
}

export default function ProjectsPage() {
  return (
    <EntityListPage<Project>
      title="Projects"
      icon="lucide:folder"
      endpoint="projects"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:folder", color: "text-emerald-400" },
        { label: "Active", value: items.filter((i) => i.status === "active").length, icon: "lucide:play", color: "text-emerald-400" },
        { label: "Completed", value: items.filter((i) => i.status === "completed").length, icon: "lucide:check-circle", color: "text-blue-400" },
        { label: "On Hold", value: items.filter((i) => i.status === "on_hold").length, icon: "lucide:pause", color: "text-yellow-400" },
      ]}
      renderItem={(project) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{project.name}</p>
              <Badge status={project.status} />
              {project.priority && <Badge status={project.priority} />}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <ProgressBar value={project.tasksCompleted ?? 0} max={project.tasksTotal ?? 1} />
              <span className="text-[9px] text-gray-500 shrink-0">{project.progress ?? 0}%</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-500">
              {project.tasksCompleted !== undefined && <span>{project.tasksCompleted} done</span>}
              {project.tasksInProgress !== undefined && <span>{project.tasksInProgress} in progress</span>}
              {project.tasksBlocked !== undefined && project.tasksBlocked > 0 && <span className="text-red-400/60">{project.tasksBlocked} blocked</span>}
              {project.deadline && <span>due {new Date(project.deadline).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}
