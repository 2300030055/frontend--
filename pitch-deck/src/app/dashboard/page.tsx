import { DashboardGenerator } from "@/components/dashboard/dashboard-generator";
import {
  DeckPreviewCards,
  RecentPresentations,
} from "@/components/dashboard/deck-preview-cards";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-600">
          Generate pitch decks from your README files
        </p>
      </div>

      <DashboardGenerator />

      <RecentPresentations />

      <DeckPreviewCards />
    </div>
  );
}
