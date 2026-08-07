"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { loadingSteps } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function LoadingPageContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 2500;
    let step = 0;

    const progressTimer = setInterval(() => {
      setProgress(() => {
        const target = ((step + 1) / loadingSteps.length) * 100;
        return Math.min(target, 100);
      });
    }, 100);

    const stepTimer = setInterval(() => {
      if (step >= loadingSteps.length - 1) {
        clearInterval(stepTimer);
        clearInterval(progressTimer);
        setProgress(100);
        setTimeout(() => router.push("/result"), 1000);
        return;
      }
      step += 1;
      setCurrentStep(step);
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-lg">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-500/30"
        >
          <Loader2 className="h-10 w-10 animate-spin text-white" aria-hidden="true" />
        </motion.div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Generating Your Pitch Deck
        </h1>
        <p className="mt-2 text-slate-600">
          Our AI is crafting your investor-ready presentation
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {loadingSteps.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} aria-label="Generation progress" />

          <ol className="space-y-4" aria-label="Generation steps">
            {loadingSteps.map((step, index) => {
              const isComplete = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3 transition-all",
                    isCurrent && "shimmer bg-violet-50/50",
                    isComplete && "opacity-80"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  ) : isCurrent ? (
                    <Loader2
                      className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-violet-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        isPending ? "text-slate-400" : "text-slate-900"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
