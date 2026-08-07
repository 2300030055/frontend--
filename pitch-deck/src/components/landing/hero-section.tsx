"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenerateDeckForm } from "@/components/shared/generate-deck-form";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6">
            AI-Powered Pitch Deck Generator
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Turn Your README into an{" "}
            <span className="gradient-text">Investor-Ready Pitch Deck</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 sm:text-xl">
            Upload your README or paste a GitHub URL. Our AI transforms technical
            documentation into polished, fundable presentations in minutes.
          </p>

          <ul className="mt-8 space-y-3" aria-label="Key benefits">
            {[
              "12+ slide deck in under 2 minutes",
              "Professional startup themes",
              "PPTX & PDF export",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-slate-600">
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-violet-600"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GenerateDeckForm variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
