"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { VibeHQLogo } from "@/components/landing/VibeHQLogo";
import { useAuth } from "@/contexts/auth.context";
import companyService, { Company } from "@/services/company.service";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/contexts/toast.context";

export default function CompaniesPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await companyService.getCompanies();
      setCompanies(res.data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load companies";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await companyService.createCompany({ name, description, industry });
      setCompanies((prev) => [...prev, res.data]);
      setShowCreate(false);
      setName("");
      setDescription("");
      setIndustry("");
      toast("Company created!", "success");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to create company";
      toast(message, "error");
    } finally {
      setCreating(false);
    }
  };

  const statusColor = (status: Company["status"]) => {
    switch (status) {
      case "active": return "text-emerald-400 bg-emerald-400/10";
      case "draft": return "text-yellow-400 bg-yellow-400/10";
      case "paused": return "text-gray-400 bg-gray-400/10";
      case "archived": return "text-red-400 bg-red-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <VibeHQLogo size={24} />
          <span className="font-bold">VibeHQ</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your Companies</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your AI-powered organizations.</p>
          </div>
          <motion.button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-medium cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            New Company
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Icon icon="lucide:building-2" className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-lg font-medium mb-1">No companies yet</h2>
            <p className="text-sm text-gray-500 mb-6">Create your first AI company to get started.</p>
            <motion.button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-medium cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              Create Company
            </motion.button>
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company, i) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-[#111] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-semibold">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{company.name}</h3>
                      <p className="text-xs text-gray-500">{company.industry || "No industry set"}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(company.status)}`}>
                    {company.status}
                  </span>
                </div>
                {company.description && (
                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">{company.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-4 p-6 rounded-2xl bg-[#111] border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">New Company</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white cursor-pointer">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Inc"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Technology"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this company do?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-50 cursor-pointer"
                  whileHover={creating ? {} : { scale: 1.01 }}
                  whileTap={creating ? {} : { scale: 0.99 }}
                >
                  {creating ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Creating...
                    </span>
                  ) : (
                    "Create"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
