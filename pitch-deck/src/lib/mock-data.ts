import type {
  DeckTheme,
  FaqItem,
  LoadingStep,
  Presentation,
  PricingPlan,
  Slide,
} from "@/types";

export const GENERATION_COST_ALGO = 2.5;

export const deckThemes: { value: DeckTheme; label: string; preview: string }[] = [
  { value: "startup", label: "Startup", preview: "from-violet-500 to-indigo-600" },
  { value: "minimal", label: "Minimal", preview: "from-slate-100 to-slate-200" },
  { value: "dark", label: "Dark", preview: "from-zinc-800 to-zinc-950" },
  { value: "gradient", label: "Gradient", preview: "from-purple-500 via-blue-500 to-cyan-400" },
];

export const features = [
  {
    icon: "Sparkles" as const,
    title: "AI-Powered Storytelling",
    description:
      "Transform technical README content into compelling investor narratives with smart section mapping.",
  },
  {
    icon: "LayoutTemplate" as const,
    title: "Professional Templates",
    description:
      "Choose from startup-ready themes designed for seed and Series A pitch meetings.",
  },
  {
    icon: "Zap" as const,
    title: "Instant Generation",
    description:
      "Go from GitHub README to a full deck in under two minutes — no design skills required.",
  },
  {
    icon: "Download" as const,
    title: "Export Anywhere",
    description:
      "Download polished PPTX and PDF files compatible with Google Slides, Keynote, and PowerPoint.",
  },
  {
    icon: "Shield" as const,
    title: "Secure & Private",
    description:
      "Your repository data is processed securely and never shared with third parties.",
  },
  {
    icon: "Wallet" as const,
    title: "Pay with Algorand",
    description:
      "Seamless micropayments via x402 protocol — fast, low-cost, and blockchain-native.",
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: "Upload README",
    description: "Drop your README file or paste a GitHub repository URL.",
  },
  {
    step: 2,
    title: "AI Analysis",
    description: "Our AI extracts features, metrics, and your unique value proposition.",
  },
  {
    step: 3,
    title: "Choose Theme",
    description: "Pick a visual theme that matches your brand and audience.",
  },
  {
    step: 4,
    title: "Download Deck",
    description: "Get your investor-ready pitch deck as PPTX or PDF.",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Single Deck",
    price: "2.5 ALGO",
    description: "Perfect for one-off fundraising prep",
    features: [
      "1 pitch deck generation",
      "Up to 15 slides",
      "All theme options",
      "PPTX + PDF export",
      "x402 Algorand payment",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "15 ALGO/mo",
    description: "For founders iterating on their story",
    features: [
      "10 deck generations/month",
      "Unlimited slide edits",
      "Priority AI processing",
      "Custom branding",
      "Team sharing links",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For accelerators and VC studios",
    features: [
      "Unlimited generations",
      "White-label themes",
      "API access",
      "Dedicated support",
      "Bulk portfolio tools",
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "What file formats do you support?",
    answer:
      "You can upload .md, .txt, or .markdown README files directly, or paste any public GitHub repository URL. We parse the README automatically.",
  },
  {
    question: "How does x402 Algorand payment work?",
    answer:
      "x402 is a micropayment protocol on Algorand. Connect your wallet, authorize the transaction, and generation starts instantly. Typical cost is 2.5 ALGO per deck.",
  },
  {
    question: "Can I edit slides after generation?",
    answer:
      "Yes. After generation you can preview each slide, edit content inline, and re-export. Pro plans include unlimited edits.",
  },
  {
    question: "What slide sections are included?",
    answer:
      "Standard decks include: Title, Problem, Solution, Product Demo, Market Size, Business Model, Traction, Team, and Ask slides — tailored from your README.",
  },
  {
    question: "Is my repository data kept private?",
    answer:
      "Absolutely. README content is processed in isolated sessions and deleted after 24 hours. We never train models on your proprietary data.",
  },
];

export const recentPresentations: Presentation[] = [
  {
    id: "1",
    title: "DevFlow — Developer Productivity",
    repoUrl: "github.com/acme/devflow",
    theme: "startup",
    slideCount: 12,
    createdAt: "2026-08-06T14:30:00Z",
    status: "completed",
    thumbnailGradient: "from-violet-500 to-indigo-600",
  },
  {
    id: "2",
    title: "NeuralDB — AI Database",
    repoUrl: "github.com/startup/neuraldb",
    theme: "gradient",
    slideCount: 14,
    createdAt: "2026-08-05T09:15:00Z",
    status: "completed",
    thumbnailGradient: "from-purple-500 via-blue-500 to-cyan-400",
  },
  {
    id: "3",
    title: "CloudSync Platform",
    theme: "minimal",
    slideCount: 10,
    createdAt: "2026-08-04T16:45:00Z",
    status: "draft",
    thumbnailGradient: "from-slate-400 to-slate-600",
  },
  {
    id: "4",
    title: "PayBridge API",
    repoUrl: "github.com/fintech/paybridge",
    theme: "dark",
    slideCount: 13,
    createdAt: "2026-08-03T11:00:00Z",
    status: "completed",
    thumbnailGradient: "from-zinc-700 to-zinc-900",
  },
];

export const mockSlides: Slide[] = [
  {
    id: 1,
    title: "DevFlow",
    subtitle: "Ship faster with AI-powered developer workflows",
    content: [],
    layout: "title",
  },
  {
    id: 2,
    title: "The Problem",
    content: [
      "Developers spend 40% of time on boilerplate and context switching",
      "Existing tools are fragmented across 12+ platforms",
      "Onboarding new engineers takes 3–4 weeks on average",
    ],
    layout: "content",
  },
  {
    id: 3,
    title: "Our Solution",
    content: [
      "Unified AI workspace that understands your entire codebase",
      "Automated PR reviews, docs, and deployment pipelines",
      "Reduces onboarding time by 60%",
    ],
    layout: "content",
  },
  {
    id: 4,
    title: "Traction",
    content: ["10,000+ developers", "500 enterprise teams", "$1.2M ARR"],
    layout: "metrics",
  },
  {
    id: 5,
    title: "The Ask",
    content: [
      "Raising $3M Seed Round",
      "18-month runway to reach $5M ARR",
      "Contact: founders@devflow.io",
    ],
    layout: "content",
  },
];

export const loadingSteps: LoadingStep[] = [
  {
    id: "reading",
    label: "Reading README",
    description: "Parsing repository structure and documentation",
  },
  {
    id: "extracting",
    label: "Extracting Features",
    description: "Identifying key product features and differentiators",
  },
  {
    id: "story",
    label: "Creating Story",
    description: "Building investor narrative arc",
  },
  {
    id: "designing",
    label: "Designing Slides",
    description: "Applying theme and layout to each slide",
  },
  {
    id: "generating",
    label: "Generating PPT",
    description: "Rendering final presentation files",
  },
];
