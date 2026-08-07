"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface GenerateDeckFormProps {
  variant?: "hero" | "dashboard";
  className?: string;
}

export function GenerateDeckForm({
  variant = "hero",
  className,
}: GenerateDeckFormProps) {
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    router.push("/payment");
  }, [router]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setFileName(file.name);
    },
    []
  );

  const isHero = variant === "hero";

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "glass-card rounded-2xl p-6 sm:p-8",
          isHero && "pulse-glow"
        )}
      >
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all",
            isDragging
              ? "border-violet-500 bg-violet-50/50"
              : "border-slate-300/80 bg-white/40 hover:border-violet-300 hover:bg-violet-50/30"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          role="region"
          aria-label="Upload README file"
        >
          <Upload
            className="mb-3 h-10 w-10 text-violet-500"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-slate-700">
            {fileName ?? "Drag & drop your README here"}
          </p>
          <p className="mt-1 text-xs text-slate-500">or</p>
          <label className="mt-3 cursor-pointer">
            <span className="sr-only">Choose README file</span>
            <input
              type="file"
              accept=".md,.txt,.markdown"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="secondary" size="sm" type="button" asChild>
              <span>Upload README</span>
            </Button>
          </label>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-slate-400">or</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`github-url-${variant}`} className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            GitHub Repository URL
          </Label>
          <Input
            id={`github-url-${variant}`}
            type="url"
            placeholder="https://github.com/username/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            aria-describedby={`github-hint-${variant}`}
          />
          <p id={`github-hint-${variant}`} className="text-xs text-slate-500">
            We&apos;ll automatically fetch and parse the README
          </p>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={handleGenerate}
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          Generate Deck
        </Button>
      </div>
    </div>
  );
}
