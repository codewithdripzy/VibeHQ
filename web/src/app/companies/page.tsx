"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { VibeHQLogo } from "@/components/landing/VibeHQLogo";
import { useAuth } from "@/contexts/auth.context";
import companyService, { Company } from "@/services/company.service";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/contexts/toast.context";

export default function CompaniesPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [values, setValues] = useState("");
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

  const resetCreate = () => {
    setName("");
    setDescription("");
    setIndustry("");
    setMission("");
    setVision("");
    setValues("");
    setCreateStep(1);
  };

  const openCreate = () => {
    resetCreate();
    setShowCreate(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createStep === 1) {
      setCreateStep(2);
      return;
    }
    setCreating(true);
    try {
      const res = await companyService.createCompany({ name, description, industry, mission, vision, values: values.split(",").map((v) => v.trim()).filter(Boolean) });
      setCompanies((prev) => [...prev, res.data]);
      setShowCreate(false);
      resetCreate();
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
    <div className="flex min-h-screen">
      {/* Left side — image */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        <img
          src="/bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <VibeHQLogo size={28} />
            <span className="text-lg font-bold text-white">VibeHQ</span>
          </Link>

          <div>
            <motion.h1
              className="text-4xl xl:text-5xl font-semibold tracking-tight mb-4 font-[family-name:var(--font-stack-sans-notch)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            >
              Choose your
              <br />
              <span className="font-serif italic font-normal">company.</span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-sm max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            >
              Pick up where you left off, or start something new.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right side — companies */}
      <div className="flex w-full lg:w-1/3 flex-col bg-black">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-4">
          <VibeHQLogo size={20} />
          <span className="font-bold text-sm">VibeHQ</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight font-[family-name:var(--font-stack-sans-notch)]">
                  Your Companies
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {companies.length} {companies.length === 1 ? "company" : "companies"}
                </p>
              </div>
              <motion.button
                onClick={openCreate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-medium cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="lucide:plus" className="w-3.5 h-3.5" />
                New
              </motion.button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : companies.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-center min-h-[400px]">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <Icon icon="lucide:building-2" className="w-7 h-7 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium mb-1">No companies yet</h3>
                <p className="text-xs text-gray-600 mb-5 max-w-[200px]">
                  Create your first AI company to get started.
                </p>
                <motion.button
                  onClick={openCreate}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-medium cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="lucide:plus" className="w-3.5 h-3.5" />
                  Create Company
                </motion.button>
              </div>
            ) : (
              <div className="space-y-2">
                {companies.map((company, i) => (
                  <motion.div
                    key={company._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/companies/${company._id}`)}
                    className="p-4 rounded-xl bg-[#111] border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold shrink-0">
                        {company.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium truncate">{company.name}</h3>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor(company.status)}`}>
                            {company.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 truncate mt-0.5">
                          {company.description || company.industry || "No details"}
                        </p>
                      </div>
                      <Icon icon="lucide:chevron-right" className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              {user?.name && <p className="text-xs font-medium text-white truncate">{user.name}</p>}
              <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-[11px] text-gray-500 hover:text-white border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setShowCreate(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md mx-4 rounded-2xl bg-[#111] border border-white/10 overflow-hidden"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold font-[family-name:var(--font-stack-sans-notch)]">
                    {createStep === 1 ? "New Company" : "Company Details"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {createStep === 1 ? "What's the name and focus?" : "Set your company's direction"}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="px-6 flex gap-1.5 mb-4">
                <div className={`h-0.5 flex-1 rounded-full transition-colors ${createStep >= 1 ? "bg-white" : "bg-white/10"}`} />
                <div className={`h-0.5 flex-1 rounded-full transition-colors ${createStep >= 2 ? "bg-white" : "bg-white/10"}`} />
              </div>

              <form onSubmit={handleCreate}>
                <div className="px-6 pb-6">
                  <AnimatePresence mode="wait">
                    {createStep === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Acme Inc"
                            required
                            autoFocus
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Industry</label>
                          <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-black text-gray-500">Select industry</option>
                            <option value="SaaS" className="bg-black">SaaS</option>
                            <option value="AI / Machine Learning" className="bg-black">AI / Machine Learning</option>
                            <option value="Fintech" className="bg-black">Fintech</option>
                            <option value="E-commerce" className="bg-black">E-commerce</option>
                            <option value="Web3 / Blockchain" className="bg-black">Web3 / Blockchain</option>
                            <option value="Cybersecurity" className="bg-black">Cybersecurity</option>
                            <option value="Healthcare" className="bg-black">Healthcare</option>
                            <option value="Education" className="bg-black">Education</option>
                            <option value="Marketing" className="bg-black">Marketing</option>
                            <option value="Real Estate" className="bg-black">Real Estate</option>
                            <option value="Legal" className="bg-black">Legal</option>
                            <option value="Manufacturing" className="bg-black">Manufacturing</option>
                            <option value="Entertainment" className="bg-black">Entertainment</option>
                            <option value="Other" className="bg-black">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What does this company do?"
                            rows={2}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors resize-none"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        <p className="text-[11px] text-gray-600">
                          Define your company's purpose. These help AI agents understand your goals.
                        </p>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Mission</label>
                          <textarea
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            placeholder="What is the company's mission?"
                            rows={2}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Vision</label>
                          <textarea
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            placeholder="What is the long-term vision?"
                            rows={2}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Core Values</label>
                          <input
                            type="text"
                            value={values}
                            onChange={(e) => setValues(e.target.value)}
                            placeholder="Innovation, Speed, Quality (comma separated)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="px-6 pb-5 flex gap-2">
                  {createStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setCreateStep(1)}
                      className="py-2.5 px-4 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <motion.button
                    type="submit"
                    disabled={creating || !name.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-white text-black text-xs font-medium disabled:opacity-50 cursor-pointer"
                    whileHover={creating ? {} : { scale: 1.01 }}
                    whileTap={creating ? {} : { scale: 0.99 }}
                  >
                    {creating ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        Creating...
                      </span>
                    ) : createStep === 1 ? (
                      "Next"
                    ) : (
                      "Create"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
