"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import entityService from "@/services/entity.service";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/contexts/toast.context";
import { useCompany } from "./layout";

interface Team {
  _id: string;
  name: string;
  department: string;
  status: string;
  agents?: string[];
  metrics?: { tasksCompleted?: number; averageQualityScore?: number };
}

interface Agent {
  _id: string;
  name: string;
  role: string;
  rank: string;
  status: string;
  currentScore?: number;
  team?: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  project?: string;
  assignee?: string;
}

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

interface Meeting {
  _id: string;
  title: string;
  type: string;
  status: string;
  scheduledAt: string;
  durationMinutes?: number;
}

interface Idea {
  _id: string;
  title: string;
  status: string;
  category?: string;
  priority?: string;
}

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  budget?: number;
  budgetSpent?: number;
  metrics?: { impressions?: number; clicks?: number; conversions?: number; revenue?: number; roi?: number };
}

interface Customer {
  _id: string;
  name: string;
  status: string;
  tier?: string;
  lifetimeValue?: number;
  monthlyRevenue?: number;
}

interface AnomalyAlert {
  _id: string;
  type: string;
  severity: string;
  title: string;
  description?: string;
  acknowledged: boolean;
  resolved: boolean;
}

interface AuditEntry {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorType: string;
  timestamp: string;
  changes?: { field: string; oldValue: unknown; newValue: unknown }[];
}

interface CronJob {
  _id: string;
  name: string;
  type: string;
  status: string;
  enabled?: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  runCount?: number;
}

interface OKR {
  _id: string;
  title: string;
  status: string;
  cadence?: string;
  progress?: number;
  keyResults?: { title: string; progress: number; status: string }[];
}

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
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[status] || "text-gray-400 bg-gray-400/10"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
      <div className="h-full rounded-full bg-white/30 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SectionHeader({ icon, title, count }: { icon: string; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon icon={icon} className="w-4 h-4 text-gray-500" />
      <h3 className="text-xs font-semibold tracking-tight">{title}</h3>
      {count !== undefined && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 font-medium">{count}</span>
      )}
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon icon={icon} className="w-6 h-6 text-gray-700 mb-2" />
      <p className="text-[11px] text-gray-600">{message}</p>
    </div>
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

export { Badge, ProgressBar, SectionHeader, EmptyState, timeAgo, statusColors };

export default function CompanyDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const { company } = useCompany();

  const [teams, setTeams] = useState<Team[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        entityService.list<Team>("teams", { limit: "50" }),
        entityService.list<Agent>("agents", { limit: "50" }),
        entityService.list<Project>("projects", { limit: "20" }),
        entityService.list<Task>("tasks", { limit: "30" }),
        entityService.list<Meeting>("meetings", { limit: "10" }),
        entityService.list<Idea>("ideas", { limit: "20" }),
        entityService.list<Campaign>("campaigns", { limit: "10" }),
        entityService.list<Customer>("customers", { limit: "20" }),
        entityService.list<AnomalyAlert>("anomaly-alerts", { limit: "10" }),
        entityService.list<AuditEntry>("audit-logs", { limit: "15" }),
        entityService.list<CronJob>("cron-jobs", { limit: "10" }),
        entityService.list<OKR>("okrs", { limit: "10" }),
      ]);
      const set = <T,>(i: number, setter: (v: T[]) => void) => {
        if (results[i].status === "fulfilled") setter((results[i] as PromiseFulfilledResult<{ data: T[] }>).value.data);
      };
      set<Team>(0, setTeams);
      set<Agent>(1, setAgents);
      set<Project>(2, setProjects);
      set<Task>(3, setTasks);
      set<Meeting>(4, setMeetings);
      set<Idea>(5, setIdeas);
      set<Campaign>(6, setCampaigns);
      set<Customer>(7, setCustomers);
      set<AnomalyAlert>(8, setAlerts);
      set<AuditEntry>(9, setAuditLog);
      set<CronJob>(10, setCronJobs);
      set<OKR>(11, setOkrs);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load dashboard";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  if (loading || !company) {
    return (
      <div className="flex items-center justify-center p-20">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  const activeProjects = projects.filter((p) => p.status === "active");
  const tasksByStatus = {
    queued: tasks.filter((t) => t.status === "queued").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    in_review: tasks.filter((t) => t.status === "in_review").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  };
  const ideasByStatus = {
    proposed: ideas.filter((i) => i.status === "proposed").length,
    ai_reviewed: ideas.filter((i) => i.status === "ai_reviewed").length,
    owner_review: ideas.filter((i) => i.status === "owner_review").length,
    approved: ideas.filter((i) => i.status === "approved").length,
    in_development: ideas.filter((i) => i.status === "in_development").length,
    implemented: ideas.filter((i) => i.status === "implemented").length,
  };
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const upcomingMeetings = meetings.filter((m) => m.status === "scheduled").slice(0, 5);
  const activeCronJobs = cronJobs.filter((c) => c.status === "active");

  const metricCards = [
    { label: "Teams", value: teams.length, icon: "lucide:users", color: "text-sky-400" },
    { label: "Agents", value: agents.length, icon: "lucide:bot", color: "text-violet-400" },
    { label: "Projects", value: activeProjects.length, icon: "lucide:folder", color: "text-emerald-400" },
    { label: "Tasks", value: tasks.length, icon: "lucide:check-square", color: "text-amber-400" },
    { label: "Customers", value: customers.length, icon: "lucide:contact", color: "text-pink-400" },
    { label: "Revenue", value: `$${(company.metadata?.totalRevenue ?? 0).toLocaleString()}`, icon: "lucide:dollar-sign", color: "text-emerald-400" },
  ];

  return (
    <div className="p-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl space-y-5"
      >
        {/* Top Metrics */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5">
          {metricCards.map((m) => (
            <div key={m.label} className="p-3.5 rounded-xl bg-[#111] border border-white/5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon icon={m.icon} className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-[10px] text-gray-500">{m.label}</span>
              </div>
              <p className="text-lg font-bold">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Two-column layout: main + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:folder" title="Active Projects" count={activeProjects.length} />
              {activeProjects.length === 0 ? (
                <EmptyState icon="lucide:folder-open" message="No active projects" />
              ) : (
                <div className="space-y-2">
                  {activeProjects.slice(0, 5).map((p) => (
                    <div key={p._id} className="flex items-center gap-3 p-2.5 rounded-lg bg-black/40">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          {p.priority && <Badge status={p.priority} />}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <ProgressBar value={p.tasksCompleted ?? 0} max={p.tasksTotal ?? 1} />
                          <span className="text-[9px] text-gray-500 shrink-0">{p.progress ?? 0}%</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {p.tasksCompleted !== undefined && <span className="text-[9px] text-gray-600">{p.tasksCompleted} done</span>}
                          {p.tasksInProgress !== undefined && <span className="text-[9px] text-gray-600">{p.tasksInProgress} in progress</span>}
                          {p.tasksBlocked !== undefined && p.tasksBlocked > 0 && <span className="text-[9px] text-red-400/60">{p.tasksBlocked} blocked</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:check-square" title="Task Board" count={tasks.length} />
              {tasks.length === 0 ? (
                <EmptyState icon="lucide:list-checks" message="No tasks yet" />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-1.5">
                    {Object.entries(tasksByStatus).map(([status, count]) => (
                      <div key={status} className="text-center p-2 rounded-lg bg-black/40">
                        <p className="text-sm font-bold">{count}</p>
                        <p className="text-[8px] text-gray-500 mt-0.5">{status.replace(/_/g, " ")}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {tasks.filter((t) => t.status === "in_progress" || t.status === "blocked").slice(0, 5).map((t) => (
                      <div key={t._id} className="flex items-center gap-2 p-2 rounded-lg bg-black/40">
                        <Badge status={t.status} />
                        <p className="text-[11px] truncate flex-1">{t.title}</p>
                        <Badge status={t.priority} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:users" title="Teams" count={teams.length} />
              {teams.length === 0 ? (
                <EmptyState icon="lucide:users" message="No teams created yet" />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {teams.slice(0, 6).map((t) => (
                    <div key={t._id} className="p-3 rounded-lg bg-black/40">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium truncate">{t.name}</p>
                        <Badge status={t.status} />
                      </div>
                      <p className="text-[9px] text-gray-500 capitalize">{t.department}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] text-gray-500">{t.agents?.length ?? 0} agents</span>
                        {t.metrics?.tasksCompleted !== undefined && (
                          <span className="text-[9px] text-gray-500">{t.metrics.tasksCompleted} tasks</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:bot" title="Agents" count={agents.length} />
              {agents.length === 0 ? (
                <EmptyState icon="lucide:bot" message="No agents hired yet" />
              ) : (
                <div className="space-y-1">
                  {agents.slice(0, 8).map((a) => (
                    <div key={a._id} className="flex items-center gap-2.5 p-2 rounded-lg bg-black/40">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-semibold shrink-0">
                        {a.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium truncate">{a.name}</p>
                        <p className="text-[9px] text-gray-500 capitalize">{a.role?.replace(/_/g, " ")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.currentScore !== undefined && (
                          <span className="text-[9px] text-gray-500">{a.currentScore}%</span>
                        )}
                        <Badge status={a.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:lightbulb" title="Ideas Pipeline" count={ideas.length} />
              {ideas.length === 0 ? (
                <EmptyState icon="lucide:lightbulb" message="No ideas proposed yet" />
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-1.5">
                    {Object.entries(ideasByStatus).map(([status, count]) => (
                      <div key={status} className="text-center p-2 rounded-lg bg-black/40">
                        <p className="text-sm font-bold">{count}</p>
                        <p className="text-[8px] text-gray-500 mt-0.5">{status.replace(/_/g, " ")}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {ideas.slice(0, 5).map((i) => (
                      <div key={i._id} className="flex items-center gap-2 p-2 rounded-lg bg-black/40">
                        <Badge status={i.status} />
                        <p className="text-[11px] truncate flex-1">{i.title}</p>
                        {i.priority && <Badge status={i.priority} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:wallet" title="Finance" />
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-black/40">
                    <p className="text-[9px] text-gray-500">Revenue</p>
                    <p className="text-sm font-bold text-emerald-400">${(company.metadata?.totalRevenue ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40">
                    <p className="text-[9px] text-gray-500">Expenses</p>
                    <p className="text-sm font-bold text-red-400">${(company.metadata?.totalExpenses ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                {company.billing && (
                  <div className="p-2.5 rounded-lg bg-black/40">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[9px] text-gray-500">Budget</p>
                      <span className="text-[9px] text-gray-500 capitalize">{company.billing.plan} plan</span>
                    </div>
                    {(company.billing.monthlyBudget ?? 0) > 0 && (
                      <div className="mt-1.5">
                        <ProgressBar value={company.billing.spentThisMonth ?? 0} max={company.billing.monthlyBudget ?? 1} />
                        <p className="text-[9px] text-gray-500 mt-1">
                          ${(company.billing.spentThisMonth ?? 0).toLocaleString()} / ${(company.billing.monthlyBudget ?? 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {customers.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-black/40">
                    <p className="text-[9px] text-gray-500">Customer Pipeline</p>
                    <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                      {["lead", "prospect", "active", "churned"].map((stage) => {
                        const count = customers.filter((c) => c.status === stage).length;
                        return (
                          <div key={stage} className="text-center">
                            <p className="text-xs font-bold">{count}</p>
                            <p className="text-[8px] text-gray-500 capitalize">{stage}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:target" title="OKRs" count={okrs.length} />
              {okrs.length === 0 ? (
                <EmptyState icon="lucide:target" message="No OKRs set" />
              ) : (
                <div className="space-y-2">
                  {okrs.slice(0, 4).map((o) => (
                    <div key={o._id} className="p-2.5 rounded-lg bg-black/40">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-medium truncate">{o.title}</p>
                        <Badge status={o.status} />
                      </div>
                      {o.progress !== undefined && (
                        <div className="mt-1.5">
                          <ProgressBar value={o.progress} max={100} />
                          <p className="text-[9px] text-gray-500 mt-0.5">{o.progress}%</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:calendar" title="Upcoming Meetings" count={upcomingMeetings.length} />
              {upcomingMeetings.length === 0 ? (
                <EmptyState icon="lucide:calendar-x" message="No upcoming meetings" />
              ) : (
                <div className="space-y-1.5">
                  {upcomingMeetings.map((m) => (
                    <div key={m._id} className="p-2.5 rounded-lg bg-black/40">
                      <p className="text-[11px] font-medium truncate">{m.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-gray-500">{m.type?.replace(/_/g, " ")}</span>
                        <span className="text-[9px] text-gray-600">{timeAgo(m.scheduledAt)}</span>
                        {m.durationMinutes && <span className="text-[9px] text-gray-600">{m.durationMinutes}min</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:megaphone" title="Campaigns" count={campaigns.length} />
              {campaigns.length === 0 ? (
                <EmptyState icon="lucide:megaphone" message="No campaigns" />
              ) : (
                <div className="space-y-1.5">
                  {campaigns.slice(0, 4).map((c) => (
                    <div key={c._id} className="p-2.5 rounded-lg bg-black/40">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-medium truncate">{c.name}</p>
                        <Badge status={c.status} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-gray-500 capitalize">{c.type?.replace(/_/g, " ")}</span>
                        {c.metrics?.roi !== undefined && (
                          <span className="text-[9px] text-emerald-400">ROI {c.metrics.roi}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:zap" title="Automations" count={activeCronJobs.length} />
              {cronJobs.length === 0 ? (
                <EmptyState icon="lucide:zap" message="No automations configured" />
              ) : (
                <div className="space-y-1.5">
                  {cronJobs.slice(0, 4).map((j) => (
                    <div key={j._id} className="flex items-center gap-2 p-2 rounded-lg bg-black/40">
                      <div className={`w-1.5 h-1.5 rounded-full ${j.status === "active" ? "bg-emerald-400" : j.status === "failed" ? "bg-red-400" : "bg-gray-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] truncate">{j.name}</p>
                        <p className="text-[9px] text-gray-500">{j.runCount ?? 0} runs</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeAlerts.length > 0 && (
              <div className="p-4 rounded-xl bg-[#111] border border-red-500/10">
                <SectionHeader icon="lucide:alert-triangle" title="Active Alerts" count={activeAlerts.length} />
                <div className="space-y-1.5">
                  {activeAlerts.slice(0, 4).map((a) => (
                    <div key={a._id} className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-medium truncate">{a.title}</p>
                        <Badge status={a.severity} />
                      </div>
                      <p className="text-[9px] text-gray-500 mt-0.5 capitalize">{a.type?.replace(/_/g, " ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#111] border border-white/5">
              <SectionHeader icon="lucide:scroll" title="Recent Activity" count={auditLog.length} />
              {auditLog.length === 0 ? (
                <EmptyState icon="lucide:scroll" message="No activity yet" />
              ) : (
                <div className="space-y-1.5">
                  {auditLog.slice(0, 6).map((e) => (
                    <div key={e._id} className="p-2 rounded-lg bg-black/40">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-gray-500 capitalize">{e.action}</span>
                        <span className="text-[9px] text-gray-600">·</span>
                        <span className="text-[9px] text-gray-500 capitalize">{e.entityType?.replace(/_/g, " ")}</span>
                      </div>
                      <p className="text-[9px] text-gray-600 mt-0.5">{timeAgo(e.timestamp)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
