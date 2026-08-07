export type DeckTheme = "startup" | "minimal" | "dark" | "gradient";

export type PresentationStatus = "completed" | "processing" | "draft";

export interface Presentation {
  id: string;
  title: string;
  repoUrl?: string;
  theme: DeckTheme;
  slideCount: number;
  createdAt: string;
  status: PresentationStatus;
  thumbnailGradient: string;
}

export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string[];
  layout: "title" | "content" | "metrics" | "team";
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LoadingStep {
  id: string;
  label: string;
  description: string;
}

export type PaymentStatus = "idle" | "connecting" | "authorizing" | "confirmed" | "failed";
