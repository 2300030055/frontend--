import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResultPageContent } from "@/components/result/result-page-content";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  return (
    <div className="gradient-bg min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </Button>
        <ResultPageContent />
      </div>
    </div>
  );
}
