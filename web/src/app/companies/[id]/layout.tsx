"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { VibeHQLogo } from "@/components/landing/VibeHQLogo";
import { useAuth } from "@/contexts/auth.context";
import companyService, { Company } from "@/services/company.service";
import entityService from "@/services/entity.service";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/contexts/toast.context";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface DashboardCtx {
  company: Company | null;
  loading: boolean;
}

const CompanyContext = createContext<DashboardCtx>({ company: null, loading: true });
export const useCompany = () => useContext(CompanyContext);

const navItems = [
  { label: "Dashboard", icon: "lucide:layout-dashboard", path: "" },
  { label: "Teams", icon: "lucide:users", path: "teams" },
  { label: "Agents", icon: "lucide:bot", path: "agents" },
  { label: "Projects", icon: "lucide:folder", path: "projects" },
  { label: "Tasks", icon: "lucide:check-square", path: "tasks" },
  {
    label: "Meetings",
    icon: "lucide:calendar",
    path: "meetings",
    children: [
      { label: "All Meetings", icon: "lucide:list", path: "meetings" },
      { label: "War Room", icon: "lucide:message-circle", path: "war-room" },
    ],
  },
  { label: "Documents", icon: "lucide:file-text", path: "documents" },
  { label: "Ideas", icon: "lucide:lightbulb", path: "ideas" },
  { label: "Customers", icon: "lucide:contact", path: "customers" },
  { label: "Campaigns", icon: "lucide:megaphone", path: "campaigns" },
  { label: "OKRs", icon: "lucide:target", path: "okrs" },
  { label: "Finance", icon: "lucide:wallet", path: "finance" },
  { label: "Channels", icon: "lucide:message-square", path: "channels" },
  { label: "Automations", icon: "lucide:zap", path: "automations" },
  { label: "Alerts", icon: "lucide:alert-triangle", path: "alerts" },
  { label: "Requests", icon: "lucide:hand-helping", path: "requests" },
  { label: "Audit Log", icon: "lucide:scroll", path: "audit" },
  { label: "Settings", icon: "lucide:settings", path: "settings" },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["Meetings"]));

  useEffect(() => {
    const load = async () => {
      try {
        const [companyRes, notifRes] = await Promise.allSettled([
          companyService.getCompany(id),
          entityService.list<Notification>("notifications", { limit: "10" }),
        ]);
        if (companyRes.status === "fulfilled") setCompany(companyRes.value.data);
        else { toast("Failed to load company", "error"); router.push("/companies"); return; }
        if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Failed to load";
        toast(message, "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const basePath = `/companies/${id}`;

  const isActive = (path: string) => {
    const full = path ? `${basePath}/${path}` : basePath;
    return pathname === full;
  };

  const isParentActive = (item: any) => {
    if (item.children) {
      return item.children.some((child: any) => isActive(child.path));
    }
    return isActive(item.path);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <CompanyContext.Provider value={{ company, loading }}>
      <div className="flex min-h-screen bg-black">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-56 flex-col border-r border-white/5 shrink-0 sticky top-0 h-screen">
          <div className="p-4 flex items-center gap-2">
            <VibeHQLogo size={18} />
            <span className="text-xs font-bold">VibeHQ</span>
          </div>
          <nav className="flex-1 px-2 space-y-0.5">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.has(item.label);
              const parentActive = isParentActive(item);

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                        parentActive ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <Icon icon={item.icon} className="w-3.5 h-3.5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <Icon
                        icon={isExpanded ? "lucide:chevron-down" : "lucide:chevron-right"}
                        className="w-3 h-3 opacity-50"
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {item.children!.map((child) => (
                          <Link
                            key={child.path}
                            href={`${basePath}/${child.path}`}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                              isActive(child.path) ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            }`}
                          >
                            <Icon icon={child.icon} className="w-3.5 h-3.5" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.path ? `${basePath}/${item.path}` : basePath}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                    isActive(item.path) ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Icon icon={item.icon} className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                {user?.name && <p className="text-[11px] font-medium truncate">{user.name}</p>}
                <p className="text-[9px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-12 flex items-center justify-between px-5 border-b border-white/5 shrink-0 sticky top-0 z-10 bg-black">
            <div className="flex items-center gap-3">
              <Link href="/companies" className="text-gray-500 hover:text-white transition-colors lg:hidden">
                <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              </Link>
              {company && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-semibold">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold leading-tight">{company.name}</h1>
                    <p className="text-[9px] text-gray-500">{company.industry || "No industry"}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <div className="relative">
                  <Icon icon="lucide:bell" className="w-4 h-4 text-gray-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-[7px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                </div>
              )}
              <button
                onClick={logout}
                className="text-[10px] text-gray-500 hover:text-white border border-white/10 hover:border-white/20 px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </CompanyContext.Provider>
  );
}
