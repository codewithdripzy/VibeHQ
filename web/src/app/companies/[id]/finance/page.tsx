"use client";

import EntityListPage, { Badge, ProgressBar } from "@/components/entity-list-page";
import { useCompany } from "../layout";

interface Expense {
  _id: string;
  title: string;
  category: string;
  status: string;
  amount: number;
  currency?: string;
  vendor?: string;
}

interface Revenue {
  _id: string;
  type: string;
  amount: number;
  currency?: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  currency?: string;
}

export default function FinancePage() {
  const { company } = useCompany();

  return (
    <div className="p-5">
      <div className="max-w-6xl space-y-5">
        {/* Revenue & Expenses overview from company metadata */}
        {company && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
              <span className="text-[10px] text-gray-500">Total Revenue</span>
              <p className="text-lg font-bold text-emerald-400">${(company.metadata?.totalRevenue ?? 0).toLocaleString()}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
              <span className="text-[10px] text-gray-500">Total Expenses</span>
              <p className="text-lg font-bold text-red-400">${(company.metadata?.totalExpenses ?? 0).toLocaleString()}</p>
            </div>
            {company.billing && (
              <>
                <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
                  <span className="text-[10px] text-gray-500">Monthly Budget</span>
                  <p className="text-lg font-bold">${(company.billing.monthlyBudget ?? 0).toLocaleString()}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#111] border border-white/5">
                  <span className="text-[10px] text-gray-500">Spent This Month</span>
                  <p className="text-lg font-bold">${(company.billing.spentThisMonth ?? 0).toLocaleString()}</p>
                  {(company.billing.monthlyBudget ?? 0) > 0 && (
                    <div className="mt-1.5">
                      <ProgressBar value={company.billing.spentThisMonth ?? 0} max={company.billing.monthlyBudget ?? 1} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <EntityListPage<Expense>
          title="Expenses"
          icon="lucide:receipt"
          endpoint="expenses"
          stats={(items) => [
            { label: "Total", value: items.length, icon: "lucide:receipt", color: "text-red-400" },
            { label: "Pending", value: items.filter((i) => i.status === "pending").length, icon: "lucide:clock", color: "text-amber-400" },
            { label: "Approved", value: items.filter((i) => i.status === "approved").length, icon: "lucide:check-circle", color: "text-emerald-400" },
            { label: "Total Amount", value: `$${items.reduce((a, i) => a + i.amount, 0).toLocaleString()}`, icon: "lucide:dollar-sign", color: "text-red-400" },
          ]}
          renderItem={(expense) => (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium truncate">{expense.title}</p>
                  <Badge status={expense.status} />
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 capitalize">{expense.category?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                  <span className="text-red-400 font-medium">${expense.amount.toLocaleString()}</span>
                  {expense.vendor && <span>{expense.vendor}</span>}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
