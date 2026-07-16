"use client";

import EntityListPage, { Badge } from "@/components/entity-list-page";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  status: string;
  tier?: string;
  lifetimeValue?: number;
  monthlyRevenue?: number;
  source?: string;
}

export default function CustomersPage() {
  return (
    <EntityListPage<Customer>
      title="Customers"
      icon="lucide:contact"
      endpoint="customers"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:contact", color: "text-pink-400" },
        { label: "Active", value: items.filter((i) => i.status === "active").length, icon: "lucide:check-circle", color: "text-emerald-400" },
        { label: "Prospects", value: items.filter((i) => i.status === "prospect").length, icon: "lucide:user-plus", color: "text-sky-400" },
        { label: "Churned", value: items.filter((i) => i.status === "churned").length, icon: "lucide:user-minus", color: "text-red-400" },
      ]}
      renderItem={(customer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-semibold shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium truncate">{customer.name}</p>
              <Badge status={customer.status} />
              {customer.tier && <Badge status={customer.tier} />}
            </div>
            {customer.email && <p className="text-[10px] text-gray-500 mt-0.5 truncate">{customer.email}</p>}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            {customer.source && <span className="capitalize">{customer.source}</span>}
            {customer.lifetimeValue !== undefined && <span>${customer.lifetimeValue.toLocaleString()}</span>}
            {customer.monthlyRevenue !== undefined && <span>${customer.monthlyRevenue.toLocaleString()}/mo</span>}
          </div>
        </div>
      )}
    />
  );
}
