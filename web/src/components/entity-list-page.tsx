"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import entityService from "@/services/entity.service";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/contexts/toast.context";

const statusColors: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-400/10",
  draft: "text-yellow-400 bg-yellow-400/10",
  paused: "text-gray-400 bg-gray-400/10",
  archived: "text-red-400 bg-red-400/10",
  completed: "text-blue-400 bg-blue-400/10",
  in_progress: "text-violet-400 bg-violet-400/10",
  queued: "text-gray-400 bg-gray-400/10",
  blocked: "text-red-400 bg-red-400/10",
  cancelled: "text-red-400 bg-red-400/10",
  on_hold: "text-yellow-400 bg-yellow-400/10",
  planning: "text-sky-400 bg-sky-400/10",
  in_review: "text-amber-400 bg-amber-400/10",
  failed: "text-red-400 bg-red-400/10",
  idle: "text-gray-400 bg-gray-400/10",
  working: "text-emerald-400 bg-emerald-400/10",
  offline: "text-gray-500 bg-gray-500/10",
  scheduled: "text-sky-400 bg-sky-400/10",
  proposed: "text-sky-400 bg-sky-400/10",
  approved: "text-emerald-400 bg-emerald-400/10",
  rejected: "text-red-400 bg-red-400/10",
  ai_reviewed: "text-violet-400 bg-violet-400/10",
  owner_review: "text-amber-400 bg-amber-400/10",
  in_development: "text-violet-400 bg-violet-400/10",
  implemented: "text-emerald-400 bg-emerald-400/10",
  low: "text-gray-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
  urgent: "text-red-400",
  lead: "text-sky-400 bg-sky-400/10",
  prospect: "text-violet-400 bg-violet-400/10",
  churned: "text-red-400 bg-red-400/10",
  enterprise: "text-amber-400 bg-amber-400/10",
  smb: "text-sky-400 bg-sky-400/10",
  standard: "text-gray-400 bg-gray-400/10",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[status] || "text-gray-400 bg-gray-400/10"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
      <div className="h-full rounded-full bg-white/30 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon icon={icon} className="w-10 h-10 text-gray-800 mb-3" />
      <p className="text-xs text-gray-600">{message}</p>
    </div>
  );
}

export function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface EntityPageProps<T> {
  title: string;
  icon: string;
  endpoint: string;
  renderItem: (item: T) => React.ReactNode;
  stats?: (items: T[]) => { label: string; value: string | number; icon: string; color: string }[];
}

export default function EntityListPage<T extends { _id: string }>({ title, icon, endpoint, renderItem, stats }: EntityPageProps<T>) {
  const { toast } = useToast();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await entityService.list<T>(endpoint, { limit: "100" });
        setItems(res.data);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : `Failed to load ${title}`;
        toast(message, "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint]);

  const statCards = stats?.(items);

  return (
    <div className="p-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl space-y-5"
      >
        <div className="flex items-center gap-2.5">
          <Icon icon={icon} className="w-5 h-5 text-gray-400" />
          <h1 className="text-lg font-bold">{title}</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-medium">{items.length}</span>
        </div>

        {statCards && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {statCards.map((s) => (
              <div key={s.label} className="p-3.5 rounded-xl bg-[#111] border border-white/5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon icon={s.icon} className={`w-3.5 h-3.5 ${s.color}`} />
                  <span className="text-[10px] text-gray-500">{s.label}</span>
                </div>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 rounded-xl bg-[#111] border border-white/5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <EmptyState icon={icon} message={`No ${title.toLowerCase()} yet`} />
          ) : (
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item._id} className="p-3 rounded-lg bg-black/40 hover:bg-white/[0.03] transition-colors">
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
