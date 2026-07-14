"use client";

import { motion, type Variants } from "framer-motion";

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 } },
};

export function FeatureAgents() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-500 mb-6">
              <span>✨</span>
              <span>AI Agents</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight font-[family-name:var(--font-stack-sans-notch)]">
              Hire an entire startup, not a single assistant.
            </h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              VibeHQ models a real startup organizational hierarchy with over 40
              specialized AI roles — from CEOs and CTOs to engineers, designers,
              marketers, and sales reps. Each agent has identity, memory, career
              progression, and autonomous decision-making.
            </p>
            <motion.a
              href="/auth?mode=signup"
              className="inline-flex px-6 py-3 rounded-full bg-white text-black font-medium text-sm items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.div
            className="rounded-3xl overflow-hidden p-8 border border-white/10 relative min-h-[400px]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/bg-a.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["CEO Agent", "Engineers", "Designers", "Marketing"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                    <div className="bg-white/5 rounded-xl p-3 text-sm text-gray-300">
                      Hiring 3 backend engineers and 2 frontend engineers for
                      the new project...
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0" />
                    <div className="bg-white/10 rounded-xl p-3 text-sm text-gray-300">
                      Team assembled. Sprint planning initiated. First deliverable
                      in 48 hours.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
