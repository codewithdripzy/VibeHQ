"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface AnomalyAlert {
  _id: string;
  type: string;
  severity: string;
  title: string;
  description?: string;
  acknowledged: boolean;
  resolved: boolean;
  metric?: string;
  currentValue?: number;
  expectedValue?: number;
  detectedBy?: string;
}

export default function AlertsPage() {
  return (
    <EntityListPage<AnomalyAlert>
      title="Alerts"
      icon="lucide:alert-triangle"
      endpoint="anomaly-alerts"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:alert-triangle", color: "text-amber-400" },
        { label: "Active", value: items.filter((i) => !i.resolved).length, icon: "lucide:bell", color: "text-red-400" },
        { label: "Acknowledged", value: items.filter((i) => i.acknowledged && !i.resolved).length, icon: "lucide:eye", color: "text-yellow-400" },
        { label: "Resolved", value: items.filter((i) => i.resolved).length, icon: "lucide:check-circle", color: "text-emerald-400" },
      ]}
      renderItem={(alert) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shrink-0 ${alert.resolved ? "bg-emerald-400" : alert.severity === "critical" || alert.severity === "high" ? "bg-red-400" : alert.severity === "medium" ? "bg-yellow-400" : "bg-gray-500"}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{alert.title}</p>
              <Badge status={alert.severity} />
              <Badge status={alert.resolved ? "resolved" : alert.acknowledged ? "acknowledged" : "active"} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
              <span className="capitalize">{alert.type?.replace(/_/g, " ")}</span>
              {alert.metric && <span>{alert.metric}</span>}
              {alert.currentValue !== undefined && alert.expectedValue !== undefined && (
                <span>{alert.currentValue} vs {alert.expectedValue} expected</span>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
