"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface CronJob {
  _id: string;
  name: string;
  type: string;
  status: string;
  enabled?: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  runCount?: number;
  cronExpression?: string;
}

interface Workflow {
  _id: string;
  name: string;
  status: string;
  trigger?: { type: string };
  steps?: { stepId: string; name: string; type: string }[];
  executionCount?: number;
}

export default function AutomationsPage() {
  return (
    <div className="p-5">
      <div className="max-w-6xl space-y-5">
        <EntityListPage<CronJob>
          title="Cron Jobs"
          icon="lucide:clock"
          endpoint="cron-jobs"
          stats={(items) => [
            { label: "Total", value: items.length, icon: "lucide:clock", color: "text-sky-400" },
            { label: "Active", value: items.filter((i) => i.status === "active").length, icon: "lucide:play", color: "text-emerald-400" },
            { label: "Paused", value: items.filter((i) => i.status === "paused").length, icon: "lucide:pause", color: "text-yellow-400" },
            { label: "Failed", value: items.filter((i) => i.status === "failed").length, icon: "lucide:x-circle", color: "text-red-400" },
          ]}
          renderItem={(job) => (
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${job.status === "active" ? "bg-emerald-400" : job.status === "failed" ? "bg-red-400" : job.status === "paused" ? "bg-yellow-400" : "bg-gray-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium truncate">{job.name}</p>
                  <Badge status={job.status} />
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 capitalize">{job.type}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                  {job.cronExpression && <span className="font-mono">{job.cronExpression}</span>}
                  <span>{job.runCount ?? 0} runs</span>
                  {job.lastRunAt && <span>last: {new Date(job.lastRunAt).toLocaleDateString()}</span>}
                  {job.nextRunAt && <span>next: {new Date(job.nextRunAt).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
