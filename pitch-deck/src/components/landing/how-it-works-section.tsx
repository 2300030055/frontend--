"use client";

import { motion } from "framer-motion";
import { howItWorksSteps } from "@/lib/mock-data";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Four simple steps from README to investor-ready pitch deck.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-violet-300 via-indigo-300 to-blue-300 lg:block"
            aria-hidden="true"
          />

          <ol className="space-y-12 lg:space-y-0">
            {howItWorksSteps.map((step, index) => (
              <motion.li
                key={step.step}
                className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:py-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div
                  className={`lg:pr-12 ${index % 2 === 1 ? "lg:order-2 lg:pl-12 lg:pr-0" : ""}`}
                >
                  <div
                    className={`glass-card rounded-2xl p-8 ${index % 2 === 1 ? "lg:ml-auto" : ""} max-w-md`}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                      {step.step}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-slate-600">{step.description}</p>
                  </div>
                </div>

                <div
                  className={`hidden lg:flex lg:items-center ${index % 2 === 1 ? "lg:order-1 lg:justify-end" : ""}`}
                  aria-hidden="true"
                >
                  <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 ring-4 ring-white">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
