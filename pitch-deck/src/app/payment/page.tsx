import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PaymentPageContent } from "@/components/payment/payment-page-content";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  return (
    <div className="gradient-bg min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </Button>
        <PaymentPageContent />
      </div>
    </div>
  );
}
