"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  FileText,
  Share2,
} from "lucide-react";
import { mockSlides } from "@/lib/mock-data";
import type { Slide } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SlidePreview({ slide }: { slide: Slide }) {
  return (
    <div className="flex aspect-video flex-col justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl shadow-violet-500/30">
      {slide.layout === "title" ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{slide.title}</h2>
          {slide.subtitle && (
            <p className="mt-4 text-lg text-white/80">{slide.subtitle}</p>
          )}
        </div>
      ) : slide.layout === "metrics" ? (
        <div>
          <h2 className="mb-8 text-2xl font-bold">{slide.title}</h2>
          <div className="grid grid-cols-3 gap-4">
            {slide.content.map((metric) => (
              <div
                key={metric}
                className="rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-xl font-bold">{metric.split(" ")[0]}</p>
                <p className="mt-1 text-sm text-white/70">
                  {metric.split(" ").slice(1).join(" ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-6 text-2xl font-bold">{slide.title}</h2>
          <ul className="space-y-3">
            {slide.content.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white/80" />
                <span className="text-lg text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ResultPageContent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = mockSlides[currentSlide];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            DevFlow Pitch Deck
          </h1>
          <p className="mt-1 text-slate-600">
            {mockSlides.length} slides &middot; Startup theme
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4" aria-hidden="true" />
            PPTX
          </Button>
          <Button variant="secondary">
            <FileText className="h-4 w-4" aria-hidden="true" />
            PDF
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SlidePreview slide={slide} />
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
                  disabled={currentSlide === 0}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>
                <span className="text-sm text-slate-500">
                  Slide {currentSlide + 1} of {mockSlides.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCurrentSlide((p) =>
                      Math.min(mockSlides.length - 1, p + 1)
                    )
                  }
                  disabled={currentSlide === mockSlides.length - 1}
                  aria-label="Next slide"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex gap-2">
            <Button>
              <Edit3 className="h-4 w-4" aria-hidden="true" />
              Edit Slide
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PPTX
            </Button>
            <Button variant="secondary">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Slides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" aria-label="Slide thumbnails">
                {mockSlides.map((s, index) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors",
                        currentSlide === index
                          ? "bg-violet-100 text-violet-900"
                          : "hover:bg-slate-50"
                      )}
                      aria-current={currentSlide === index ? "true" : undefined}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gradient-to-br text-xs font-bold text-white",
                          currentSlide === index
                            ? "from-violet-600 to-indigo-600"
                            : "from-slate-400 to-slate-500"
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{s.title}</p>
                        <Badge variant="outline" className="mt-0.5 text-[10px]">
                          {s.layout}
                        </Badge>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
