"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import entityService from "@/services/entity.service";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/contexts/toast.context";

const statusColors: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  approved: "text-emerald-400 bg-emerald-400/10",
  denied: "text-red-400 bg-red-400/10",
  fulfilled: "text-sky-400 bg-sky-400/10",
  cancelled: "text-gray-400 bg-gray-400/10",
};

const typeIcons: Record<string, string> = {
  integration: "lucide:plug",
  resource: "lucide:box",
  feature: "lucide:sparkles",
  access: "lucide:key",
  budget: "lucide:wallet",
  personnel: "lucide:user-plus",
  other: "lucide:help-circle",
};

interface Request {
  _id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  requestedBy?: string;
  requestedFor?: string;
  reason?: string;
  createdAt: string;
  updatedAt?: string;
  fulfilledAt?: string;
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[status] || "text-gray-400 bg-gray-400/10"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await entityService.list<Request>("requests", { limit: "100" });
        setRequests(res.data);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Failed to load requests";
        toast(message, "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const fulfilled = requests.filter((r) => r.status === "fulfilled").length;

  return (
    <div className="p-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon icon="lucide:hand-helping" className="w-5 h-5 text-gray-400" />
            <h1 className="text-lg font-bold">Requests</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-medium">{requests.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "pending", "approved", "fulfilled", "denied"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] px-2.5 py-1 rounded-md transition-colors capitalize cursor-pointer ${
                  filter === f ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-gray-500">Pending</span>
            </div>
            <p className="text-lg font-bold">{pending}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="lucide:check-circle" className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-gray-500">Approved</span>
            </div>
            <p className="text-lg font-bold">{approved}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="lucide:package-check" className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] text-gray-500">Fulfilled</span>
            </div>
            <p className="text-lg font-bold">{fulfilled}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111] border border-white/5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Icon icon="lucide:hand-helping" className="w-10 h-10 text-gray-800 mb-3" />
              <p className="text-xs text-gray-600">No requests {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((req) => (
                <div key={req._id} className="p-3.5 rounded-lg bg-black/40 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Icon icon={typeIcons[req.type] || "lucide:help-circle"} className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium truncate">{req.title}</p>
                        <Badge status={req.status} />
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 capitalize">{req.type}</span>
                        {req.priority && (
                          <span className={`text-[9px] font-medium ${
                            req.priority === "urgent" || req.priority === "critical" ? "text-red-400" :
                            req.priority === "high" ? "text-orange-400" :
                            req.priority === "medium" ? "text-yellow-400" : "text-gray-500"
                          }`}>{req.priority}</span>
                        )}
                      </div>
                      {req.description && (
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                      )}
                      {req.reason && (
                        <p className="text-[10px] text-gray-600 mt-1 italic">Reason: {req.reason}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-[9px] text-gray-600">
                        {req.requestedBy && <span>from {req.requestedBy}</span>}
                        {req.requestedFor && <span>for {req.requestedFor}</span>}
                        <span>{timeAgo(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
