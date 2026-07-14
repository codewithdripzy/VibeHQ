"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const statItem: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative z-0"
    >
      <div className="absolute inset-0 -z-10">
        <motion.img
          src="/bg-alt.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 backdrop-blur-sm">
            <span>✨</span>
            <span>Announcing API 2.0</span>
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-center font-[family-name:var(--font-stack-sans-notch)]"
        >
          Your AI company.
          <br />
          <span className="font-serif italic font-normal">Running itself.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-[16px] text-gray-300 max-w-2xl mx-auto mb-10"
        >
          VibeHQ transforms an idea into a real business by coordinating a team
          of specialized AI employees. Hire employees, build products, serve
          customers — all autonomous.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="/auth?mode=signup"
            className="px-6 py-3 rounded-full bg-white text-black font-medium text-sm inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
          <motion.a
            href="https://github.com/anomalyco/vibehq"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#1F1F22] text-white font-medium text-sm border border-white/5 inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </motion.a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-24 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "2,400+", label: "Companies built" },
            { value: "$4.2M", label: "Revenue generated" },
            { value: "$890K", label: "Monthly recurring" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={statItem}
              whileHover={{ scale: 1.05 }}
            >
              {i === 1 && <div className="border-x border-white/10 px-4 h-full" />}
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
