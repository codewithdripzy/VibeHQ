"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  budget?: number;
  budgetSpent?: number;
  metrics?: { impressions?: number; clicks?: number; conversions?: number; revenue?: number; roi?: number };
}

export default function CampaignsPage() {
  return (
    <EntityListPage<Campaign>
      title="Campaigns"
      icon="lucide:megaphone"
      endpoint="campaigns"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:megaphone", color: "text-orange-400" },
        { label: "Active", value: items.filter((i) => i.status === "active").length, icon: "lucide:play", color: "text-emerald-400" },
        { label: "Completed", value: items.filter((i) => i.status === "completed").length, icon: "lucide:check-circle", color: "text-blue-400" },
        { label: "Total Budget", value: `$${items.reduce((a, i) => a + (i.budget ?? 0), 0).toLocaleString()}`, icon: "lucide:wallet", color: "text-amber-400" },
      ]}
      renderItem={(campaign) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{campaign.name}</p>
              <Badge status={campaign.status} />
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 capitalize">{campaign.type?.replace(/_/g, " ")}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-[10px] text-gray-500">
              {campaign.budget !== undefined && <span>Budget: ${campaign.budget.toLocaleString()}</span>}
              {campaign.budgetSpent !== undefined && <span>Spent: ${campaign.budgetSpent.toLocaleString()}</span>}
              {campaign.metrics?.roi !== undefined && <span className="text-emerald-400">ROI {campaign.metrics.roi}%</span>}
              {campaign.metrics?.impressions !== undefined && <span>{campaign.metrics.impressions.toLocaleString()} impressions</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}
