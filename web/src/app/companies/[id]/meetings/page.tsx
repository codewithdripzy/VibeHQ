"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Meeting {
  _id: string;
  title: string;
  type: string;
  status: string;
  scheduledAt: string;
  durationMinutes?: number;
}

export default function MeetingsPage() {
  return (
    <EntityListPage<Meeting>
      title="Meetings"
      icon="lucide:calendar"
      endpoint="meetings"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:calendar", color: "text-sky-400" },
        { label: "Scheduled", value: items.filter((i) => i.status === "scheduled").length, icon: "lucide:clock", color: "text-sky-400" },
        { label: "Completed", value: items.filter((i) => i.status === "completed").length, icon: "lucide:check-circle", color: "text-emerald-400" },
        { label: "Cancelled", value: items.filter((i) => i.status === "cancelled").length, icon: "lucide:x-circle", color: "text-red-400" },
      ]}
      renderItem={(meeting) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{meeting.title}</p>
              <Badge status={meeting.status} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
              <span className="capitalize">{meeting.type?.replace(/_/g, " ")}</span>
              <span>{new Date(meeting.scheduledAt).toLocaleDateString()}</span>
              {meeting.durationMinutes && <span>{meeting.durationMinutes}min</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}
