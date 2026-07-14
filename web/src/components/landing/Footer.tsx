"use client";

import { motion } from "framer-motion";
import { VibeHQLogo } from "./VibeHQLogo";

const productLinks = [
  { name: "About", href: "#about" },
  { name: "Pricing", href: "#" },
  { name: "Changelog", href: "#" },
  { name: "Contact", href: "#contact" },
];

const legalLinks = [
  { name: "Terms of service", href: "#" },
  { name: "Privacy policy", href: "#" },
  { name: "404", href: "#" },
];

const socialLinks = [
  { name: "Instagram", href: "#" },
  { name: "YouTube", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "Twitter / X", href: "#" },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Footer() {
  return (
    <footer id="contact" className="relative z-0 pt-32 pb-10 px-6">
      <div className="absolute inset-0 -z-10">
        <img
          src="/bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-32">
        <motion.h2
          className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight font-[family-name:var(--font-stack-sans-notch)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          Ready to build your
          <br />
          <span className="font-serif italic font-normal">autonomous company?</span>
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.a
            href="#about"
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
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-24"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <VibeHQLogo size={24} />
            <span className="text-xl font-bold text-white">VibeHQ</span>
          </div>
          <p className="text-sm text-gray-400">
            Speed, scale, and smarts — deployed.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
          <ul className="space-y-3">
            {productLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
          <ul className="space-y-3">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-500 pt-8">
        <span>© 2026 VibeHQ. All rights reserved.</span>
      </div>
    </footer>
  );
}
