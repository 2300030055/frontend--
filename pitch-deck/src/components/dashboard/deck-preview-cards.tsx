import Link from "next/link";
import { Clock, ExternalLink, Presentation } from "lucide-react";
import { recentPresentations } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function RecentPresentations() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Presentations</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/result">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" aria-label="Recent presentations">
          {recentPresentations.map((presentation) => (
            <li key={presentation.id}>
              <Link
                href="/result"
                className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-violet-50/50"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                    presentation.thumbnailGradient
                  )}
                  aria-hidden="true"
                >
                  <Presentation className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">
                    {presentation.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {formatDate(presentation.createdAt)}
                    <span aria-hidden="true">&middot;</span>
                    {presentation.slideCount} slides
                  </div>
                </div>
                <Badge
                  variant={
                    presentation.status === "completed" ? "success" : "outline"
                  }
                >
                  {presentation.status}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function DeckPreviewCards() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Deck Previews
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {recentPresentations.slice(0, 4).map((deck) => (
          <Card
            key={deck.id}
            className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-violet-500/10"
          >
            <div
              className={cn(
                "flex h-32 items-end bg-gradient-to-br p-4",
                deck.thumbnailGradient
              )}
            >
              <div className="rounded-lg bg-white/90 px-3 py-2 backdrop-blur-sm">
                <p className="text-sm font-semibold text-slate-900">
                  {deck.title}
                </p>
                <p className="text-xs text-slate-500">
                  {deck.slideCount} slides &middot; {deck.theme}
                </p>
              </div>
            </div>
            <CardContent className="flex items-center justify-between p-4">
              <div className="min-w-0">
                {deck.repoUrl && (
                  <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {deck.repoUrl}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/result">Preview</Link>
                </Button>
                <Button variant="secondary" size="sm">
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
