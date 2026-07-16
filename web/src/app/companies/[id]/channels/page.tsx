"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Channel {
  _id: string;
  name: string;
  type: string;
  description?: string;
  members?: string[];
  messageCount?: number;
  isArchived?: boolean;
}

export default function ChannelsPage() {
  return (
    <EntityListPage<Channel>
      title="Channels"
      icon="lucide:message-square"
      endpoint="channels"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:message-square", color: "text-sky-400" },
        { label: "Active", value: items.filter((i) => !i.isArchived).length, icon: "lucide:hash", color: "text-emerald-400" },
        { label: "Archived", value: items.filter((i) => i.isArchived).length, icon: "lucide:archive", color: "text-gray-400" },
        { label: "Total Messages", value: items.reduce((a, i) => a + (i.messageCount ?? 0), 0).toLocaleString(), icon: "lucide:message-circle", color: "text-violet-400" },
      ]}
      renderItem={(channel) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] text-gray-400">#</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{channel.name}</p>
              <Badge status={channel.type} />
              {channel.isArchived && <span className="text-[9px] text-gray-600">archived</span>}
            </div>
            {channel.description && <p className="text-[10px] text-gray-500 truncate mt-0.5">{channel.description}</p>}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span>{channel.members?.length ?? 0} members</span>
            {channel.messageCount !== undefined && <span>{channel.messageCount} messages</span>}
          </div>
        </div>
      )}
    />
  );
}
