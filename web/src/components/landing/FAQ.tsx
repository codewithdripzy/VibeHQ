"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does VibeHQ work?",
    answer:
      "VibeHQ creates an autonomous organization of AI employees. You describe your idea, and the AI CEO coordinates specialized agents — engineers, designers, marketers, and more — to plan, build, launch, and grow your business.",
  },
  {
    question: "Is my data safe with VibeHQ?",
    answer:
      "Yes. VibeHQ uses enterprise-grade security with encrypted data at rest, role-based access control, and complete audit logging. Your company data is isolated and never shared with other organizations.",
  },
  {
    question: "Can I control what the AI employees do?",
    answer:
      "Absolutely. You maintain final approval authority on all critical decisions — deployments, spending, hiring, and more. Each agent has configurable autonomy levels, and you can override any decision at any time.",
  },
  {
    question: "How much does VibeHQ cost?",
    answer:
      "VibeHQ offers flexible pricing based on your company size and usage. Start with a free tier to explore the platform, then scale as your AI company grows. Contact us for enterprise pricing.",
  },
  {
    question: "What kind of businesses can VibeHQ build?",
    answer:
      "VibeHQ can build software products, SaaS applications, landing pages, marketing campaigns, and more. The platform adapts to your idea and assembles the right team of AI specialists to bring it to life.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-semibold mb-12 text-center tracking-tight font-[family-name:var(--font-stack-sans-notch)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
        >
          We&apos;ve got answers
        </motion.h2>

        <motion.div
          className="border border-white/10 rounded-xl bg-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={
                index < faqs.length - 1 ? "border-b border-white/10" : ""
              }
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-6 px-6 text-left"
              >
                <span className="text-base text-white font-medium">
                  {faq.question}
                </span>
                <motion.svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-400 text-sm pb-6 px-6">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
