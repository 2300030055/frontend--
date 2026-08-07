"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Wallet,
} from "lucide-react";
import { GENERATION_COST_ALGO } from "@/lib/mock-data";
import type { PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  PaymentStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  idle: { label: "Awaiting wallet connection", color: "text-slate-500", icon: Wallet },
  connecting: { label: "Connecting wallet...", color: "text-violet-600", icon: Loader2 },
  authorizing: { label: "Authorizing payment...", color: "text-indigo-600", icon: Loader2 },
  confirmed: { label: "Payment confirmed", color: "text-emerald-600", icon: CheckCircle2 },
  failed: { label: "Payment failed", color: "text-red-600", icon: AlertCircle },
};

export function PaymentPageContent() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("idle");

  const handleConnectWallet = useCallback(async () => {
    setStatus("connecting");
    await new Promise((r) => setTimeout(r, 1500));
    setWalletConnected(true);
    setWalletAddress("ALGO7...X4K9");
    setStatus("idle");
  }, []);

  const handleAuthorize = useCallback(async () => {
    setStatus("authorizing");
    await new Promise((r) => setTimeout(r, 2000));
    setStatus("confirmed");
  }, []);

  const handleContinue = useCallback(() => {
    router.push("/generating");
  }, [router]);

  const StatusIcon = statusConfig[status].icon;
  const isLoading = status === "connecting" || status === "authorizing";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Complete Payment
        </h1>
        <p className="mt-2 text-slate-600">
          Pay with Algorand via x402 to generate your pitch deck
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Generation Cost
            <Badge variant="secondary">x402 Protocol</Badge>
          </CardTitle>
          <CardDescription>One-time payment per deck generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold gradient-text">
              {GENERATION_COST_ALGO} ALGO
            </span>
            <span className="text-sm text-slate-500">≈ $0.50 USD</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Up to 15 slides</li>
            <li>• All theme options included</li>
            <li>• PPTX + PDF export</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Algorand Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to authorize the micropayment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!walletConnected ? (
            <Button
              size="lg"
              className="w-full"
              onClick={handleConnectWallet}
              disabled={isLoading}
            >
              {status === "connecting" ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Wallet className="h-5 w-5" aria-hidden="true" />
              )}
              Connect Algorand Wallet
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-emerald-800">
                    Wallet Connected
                  </span>
                </div>
                <code className="text-xs text-emerald-700">{walletAddress}</code>
              </div>

              {status !== "confirmed" && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAuthorize}
                  disabled={isLoading}
                >
                  {status === "authorizing" ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Wallet className="h-5 w-5" aria-hidden="true" />
                  )}
                  Authorize {GENERATION_COST_ALGO} ALGO
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card
        className={cn(
          status === "confirmed" && "ring-2 ring-emerald-500/30"
        )}
        aria-live="polite"
      >
        <CardHeader>
          <CardTitle className="text-base">Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusIcon
              className={cn(
                "h-6 w-6",
                statusConfig[status].color,
                isLoading && "animate-spin"
              )}
              aria-hidden="true"
            />
            <div>
              <p className={cn("font-medium", statusConfig[status].color)}>
                {statusConfig[status].label}
              </p>
              {status === "confirmed" && (
                <p className="text-sm text-slate-500">
                  Transaction ID: TXN...8F2A (mock)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        disabled={status !== "confirmed"}
        onClick={handleContinue}
      >
        Continue to Generation
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
