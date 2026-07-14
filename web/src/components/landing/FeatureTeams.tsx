"use client";

import { motion, type Variants } from "framer-motion";

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 } },
};

export function FeatureTeams() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.div
            className="rounded-3xl overflow-hidden p-8 border border-white/10 relative min-h-[400px] order-2 lg:order-1"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/bg-b.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      10:42 AM — CEO Meeting
                    </p>
                    <p className="text-xs text-gray-400">Sprint Planning</p>
                  </div>
                </div>
                <div className="h-16 bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <div className="flex gap-1 items-end h-full py-2">
                    {[28, 15, 35, 20, 40, 12, 30, 22, 38, 18, 25, 33, 14, 36, 27, 19, 42, 16, 32, 24].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-green-500 rounded-full"
                        initial={{ height: 0 }}
                        whileInView={{ height: h }}
                        transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  &quot;The engineering team has completed 87% of sprint
                  tasks. Marketing campaign is on track for Thursday
                  launch.&quot;
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-500 mb-6">
              <span>✨</span>
              <span>Autonomous Teams</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight font-[family-name:var(--font-stack-sans-notch)]">
              Teams that plan, build, and ship on their own.
            </h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              Your AI employees organize into departments, hold meetings, create
              documents, and collaborate through an event-driven workflow. They
              detect blockers, hire additional team members, and reallocate
              resources automatically.
            </p>
            <motion.a
              href="#about"
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
      </div>
    </section>
  );
}
