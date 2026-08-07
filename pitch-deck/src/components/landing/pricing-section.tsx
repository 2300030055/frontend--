"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Wallet } from "lucide-react";
import { pricingPlans } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            <Wallet className="mr-1 h-3 w-3" aria-hidden="true" />
            x402 Algorand Payments
          </Badge>
          <h2
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Pay per deck with Algorand micropayments via the x402 protocol.
            No subscriptions required to get started.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full flex flex-col ${
                  plan.highlighted
                    ? "ring-2 ring-violet-500 shadow-xl shadow-violet-500/20"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <p className="mt-4">
                    <span className="text-4xl font-bold gradient-text">
                      {plan.price}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-violet-600"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.highlighted ? "default" : "secondary"}
                    className="w-full"
                    asChild
                  >
                    <Link href="/payment">
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          All payments processed securely via x402 on the Algorand blockchain.
          Connect any Algorand-compatible wallet to pay.
        </p>
      </div>
    </section>
  );
}
