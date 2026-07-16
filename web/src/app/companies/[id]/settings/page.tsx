"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useCompany } from "../layout";

export default function SettingsPage() {
  const { company } = useCompany();

  if (!company) {
    return (
      <div className="flex items-center justify-center p-20">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl space-y-5"
      >
        <div className="flex items-center gap-2.5">
          <Icon icon="lucide:settings" className="w-5 h-5 text-gray-400" />
          <h1 className="text-lg font-bold">Settings</h1>
        </div>

        {/* General */}
        <div className="p-4 rounded-xl bg-[#111] border border-white/5">
          <h3 className="text-xs font-semibold tracking-tight mb-3">General</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Company Name</label>
              <div className="p-2.5 rounded-lg bg-black/40 text-xs">{company.name}</div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Industry</label>
              <div className="p-2.5 rounded-lg bg-black/40 text-xs">{company.industry || "Not set"}</div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Status</label>
              <div className="p-2.5 rounded-lg bg-black/40 text-xs capitalize">{company.status}</div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Slug</label>
              <div className="p-2.5 rounded-lg bg-black/40 text-xs font-mono">{company.slug}</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="p-4 rounded-xl bg-[#111] border border-white/5">
          <h3 className="text-xs font-semibold tracking-tight mb-3">Mission & Vision</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Mission</label>
              <div className="p-2.5 rounded-lg bg-black/40 text-xs text-gray-300">{company.mission || "Not set"}</div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Vision</label>
              <div className="p-2.5 rounded-lg bg-black/40 text-xs text-gray-300">{company.vision || "Not set"}</div>
            </div>
            {company.values && company.values.length > 0 && (
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Values</label>
                <div className="flex flex-wrap gap-1.5">
                  {company.values.map((v, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400">{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billing */}
        {company.billing && (
          <div className="p-4 rounded-xl bg-[#111] border border-white/5">
            <h3 className="text-xs font-semibold tracking-tight mb-3">Billing</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Plan</p>
                <p className="text-xs font-medium capitalize">{company.billing.plan}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Monthly Budget</p>
                <p className="text-xs font-medium">${(company.billing.monthlyBudget ?? 0).toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Spent This Month</p>
                <p className="text-xs font-medium">${(company.billing.spentThisMonth ?? 0).toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Currency</p>
                <p className="text-xs font-medium">{company.settings?.defaultCurrency || "USD"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {company.settings && (
          <div className="p-4 rounded-xl bg-[#111] border border-white/5">
            <h3 className="text-xs font-semibold tracking-tight mb-3">Configuration</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Max Agents</p>
                <p className="text-xs font-medium">{company.settings.maxAgents}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Max Teams</p>
                <p className="text-xs font-medium">{company.settings.maxTeams}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Auto Hire</p>
                <p className="text-xs font-medium">{company.settings.autoHire ? "Enabled" : "Disabled"}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <p className="text-[9px] text-gray-500">Approval Required</p>
                <p className="text-xs font-medium">{company.settings.approvalRequired ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
