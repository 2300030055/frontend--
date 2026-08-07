"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeSelector } from "@/components/dashboard/theme-selector";
import { UploadZone } from "@/components/dashboard/upload-zone";
import type { DeckTheme } from "@/types";

export function DashboardGenerator() {
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState("");
  const [theme, setTheme] = useState<DeckTheme>("startup");

  const handleGenerate = useCallback(() => {
    router.push("/payment");
  }, [router]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload README</CardTitle>
          <CardDescription>
            Drop your README file or provide a GitHub repository URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UploadZone />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/60 px-2 text-slate-400">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dashboard-github-url" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              GitHub Repository URL
            </Label>
            <Input
              id="dashboard-github-url"
              type="url"
              placeholder="https://github.com/username/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customize & Generate</CardTitle>
          <CardDescription>
            Choose a theme and generate your pitch deck
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeSelector value={theme} onChange={setTheme} />

          <Button size="lg" className="w-full" onClick={handleGenerate}>
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            Generate Deck
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
