import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { 
  Github, 
  Twitter, 
  ArrowUpRight, 
  Lightbulb, 
  Terminal, 
  Layers, 
  Database, 
  GitFork, 
  Heart, 
  ShieldCheck, 
  Plus,
  Minus
} from 'lucide-react';

interface MarketingLandingProps {
  onEnterCockpit: () => void;
}

export function MarketingLanding({ onEnterCockpit }: MarketingLandingProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const stats = [
    { value: "< 50ms", label: "LOCAL LIBSQL LATENCY" },
    { value: "100%", label: "DATA AUTONOMY" },
    { value: "Zero", label: "UNSOLICITED TELEMETRY" },
    { value: "Edge-Ready", label: "CLOUDFLARE Pages & WORKERS" }
  ];

  const featuresList = [
    {
      icon: Terminal,
      title: "Vertical Slice Architecture",
      description: "No folder hopping. Features grouped with isolated schemas, routers, and write models.",
      accent: "border-zinc-800 dark:border-zinc-200/20"
    },
    {
      icon: Layers,
      title: "CQRS Division",
      description: "Rigid segregation of write commands and read queries guarantees bulletproof cache lines and instant states.",
      accent: "border-zinc-800 dark:border-zinc-200/20"
    },
    {
      icon: Database,
      title: "Local-First Persistence",
      description: "Data-safe SQLite using LibSQL. Runs locally at memory-speeds or deploys zero-cost to Turso.",
      accent: "border-amber-500/35 dark:border-amber-400/20"
    },
    {
      icon: ShieldCheck,
      title: "Monadic Error Taxonomy",
      description: "All endpoints return strict Result type boundaries. No raw stack traces or database leakages.",
      accent: "border-zinc-800 dark:border-zinc-200/20"
    }
  ];

  const faqs = [
    {
      question: "What makes PostDesk different from other social schedulers?",
      answer: "Most schedulers are bloated SaaS applications that lock your data in closed servers and charge recurring subscriptions. PostDesk is a self-hostable growth cockpit. You run it locally, own 100% of your SQLite database, and can compile and deploy it to Cloudflare Pages for free with zero middleware lock-in."
    },
    {
      question: "Does it support real-time preview of thread length constraints?",
      answer: "Yes. PostDesk is built from the ground up for X creators. It handles the strict 280-character limit, monitors threads dynamically, and provides a streamlined interface for organizing bookmarks and swipe file inspirations."
    },
    {
      question: "Is there any hidden telemetry or AI background tracking?",
      answer: "Absolutely not. PostDesk tracks nothing. In keeping with Swiss minimalism and technical privacy guidelines, there is no background telemetry, analytics, or unsolicited AI agents scanning your notes. You are in complete control of your workspace."
    },
    {
      question: "Can I connect this to a cloud-hosted database?",
      answer: "Yes, easily. PostDesk uses Drizzle ORM paired with @libsql/client. You can swap the local SQLite database path for a secure Turso DB connection string in your environment file, giving you seamless global distribution."
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen antialiased font-sans">
      {/* Top Navbar */}
      <MarketingNavbar onEnterCockpit={onEnterCockpit} />

      {/* Visual background pattern constraints */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 space-y-24">
        
        {/* HERO SECTION */}
        <header id="overview" className="scroll-mt-20 space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-extrabold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/15 uppercase">
                PostDesk Spec 1.0
              </span>
              <span className="font-mono text-[9px] font-medium text-muted-foreground/80">
                Self-Hostable • Open Source
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/bymilon/post-desk" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground border border-border/15 hover:border-border/60 bg-card/45 px-2.5 py-1 rounded-sm transition-all text-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Star on GitHub</span>
              </a>
              <a 
                href="https://x.com/milonspace" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground border border-border/15 hover:border-border/60 bg-card/45 px-2.5 py-1 rounded-sm transition-all text-xs"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-500" />
                <span>@milonspace</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground font-sans max-w-2xl">
              The high-performance content operating system for structured creators.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              An offline-first draft workspace and inspiration engine engineered for developers, advocates, and tech leaders on X. Real-time data validation, zero-bloat state management, and absolute local data control.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button 
              onClick={onEnterCockpit}
              className="h-9 px-5 text-xs font-semibold uppercase bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 cursor-pointer flex items-center gap-1.5 tracking-wider transition-all duration-150 active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5" /> Enter App Cockpit
            </Button>
            <a 
              href="https://github.com/bymilon/post-desk" 
              target="_blank" 
              rel="noreferrer"
            >
              <Button 
                variant="outline" 
                className="h-9 px-4 text-xs font-semibold uppercase border-border/45 hover:bg-muted/30 cursor-pointer flex items-center gap-1.5 tracking-wider transition-all duration-150 active:scale-95"
              >
                <GitFork className="w-3.5 h-3.5" /> Fork Codebase
              </Button>
            </a>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="border border-border/15 bg-card/15 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                  {stat.value}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase font-mono mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        <Separator className="bg-border/15" />

        {/* PROBLEM SECTION */}
        <section id="critique" className="scroll-mt-20 space-y-8">
          <div className="space-y-1.5">
            <span className="font-mono text-[9.5px] font-bold tracking-widest text-destructive uppercase">
              The Critique
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Social platforms operate as engagement traps.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Standard content management tools rely on bloated recurring SaaS dependencies, cloud-hosted lock-in layers, and user tracking engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-border/15 p-5 bg-card/10 rounded-xl space-y-2">
              <span className="font-mono text-xs font-bold text-muted-foreground/75 block">01 /</span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">Draft Fragmentation</h3>
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                Inspirations evaporate inside notes apps. Temporary drafts get lost inside browser tabs, disorganized txt documents, and social media text inputs.
              </p>
            </div>
            
            <div className="border border-border/15 p-5 bg-card/10 rounded-xl space-y-2">
              <span className="font-mono text-xs font-bold text-muted-foreground/75 block">02 /</span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">Browser Latency</h3>
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                Rich text editors and hefty marketing portals drag down performance. Writing requires fluid milliseconds speed, not loading spinners.
              </p>
            </div>

            <div className="border border-border/15 p-5 bg-card/10 rounded-xl space-y-2">
              <span className="font-mono text-xs font-bold text-muted-foreground/75 block">03 /</span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">Data Captivity</h3>
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                Your writing history resides on external servers, exposed to policy shifts and export roadblocks. Local backups are nonexistent.
              </p>
            </div>
          </div>
        </section>

        <Separator className="bg-border/15" />

        {/* SOLUTION SECTION */}
        <section id="features" className="scroll-mt-20 space-y-8">
          <div className="space-y-1.5">
            <span className="font-mono text-[9.5px] font-bold tracking-widest text-emerald-500 uppercase">
              The PostDesk Model
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Clean architectural division built for writing.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              PostDesk encapsulates vertical features together. Your post editor, inspiration swipe file, database hooks, and routing sit under a single workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {featuresList.map((item, idx) => (
              <div 
                key={idx} 
                className={`border bg-card/20 rounded-xl p-5 space-y-3 transition-colors duration-200 ${item.accent}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border/25">
                  <item.icon className="h-4.5 w-4.5 text-foreground/85" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">{item.title}</h3>
                  <p className="text-[11.5px] leading-relaxed text-muted-foreground mt-1.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-amber-500/10 bg-amber-500/5 p-4.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 border border-amber-500/15 text-amber-500 text-xs shrink-0 mt-0.5">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <div className="space-y-0.5">
                <h4 className="text-[11.5px] font-bold uppercase text-foreground tracking-wide">Dynamic Inspiration Deck</h4>
                <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                  Record references, capture tweet structures, and clip sources without interrupting your active keyboard layout.
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={onEnterCockpit}
              className="h-7 text-[10px] uppercase font-bold tracking-wider border border-amber-500/20 text-amber-600 hover:bg-amber-500/10 cursor-pointer self-start sm:self-center"
            >
              Try Deck
            </Button>
          </div>
        </section>

        <Separator className="bg-border/15" />

        {/* SOCIAL PROOF SECTION */}
        <section id="testimonials" className="scroll-mt-20 space-y-8">
          <div className="space-y-1.5">
            <span className="font-mono text-[9.5px] font-bold tracking-widest text-[#00a2ff] uppercase">
              Advocate Networks
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              What creators say about our minimalist cockpit
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Approved by writers, software engineers, and developer relation managers who operate at maximum visual throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-border/15 p-4.5 bg-muted/5 rounded-xl flex flex-col justify-between space-y-4">
              <p className="text-[11.5px] leading-relaxed text-foreground/90 font-medium italic">
                &ldquo;I transitioned from a messy Notion directory system to PostDesk's localized swipe file. My drafting speed improved substantially by having layouts and inspirations side-by-side without distractions.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-8.5 w-8.5 rounded-md bg-zinc-900 border border-border/15 flex items-center justify-center">
                  <span className="font-mono text-[10px] font-bold text-white uppercase">AD</span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-foreground">Alex Devlin</h4>
                  <p className="text-[9.5px] font-mono text-muted-foreground">Lead Developer Advocate, X creator</p>
                </div>
              </div>
            </div>

            <div className="border border-border/15 p-4.5 bg-muted/5 rounded-xl flex flex-col justify-between space-y-4">
              <p className="text-[11.5px] leading-relaxed text-foreground/90 font-medium italic">
                &ldquo;The zero-motion absolute speed swap is a complete relief. Web apps are often slow, but toggling filter criteria and updating states feels like using a native binary desktop application.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-8.5 w-8.5 rounded-md bg-zinc-900 border border-border/15 flex items-center justify-center">
                  <span className="font-mono text-[10px] font-bold text-white uppercase">MN</span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-foreground">Marta Novak</h4>
                  <p className="text-[9.5px] font-mono text-muted-foreground">Technical Copywriter & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-border/15" />

        {/* FAQ SECTION */}
        <section id="faq" className="scroll-mt-20 space-y-6">
          <div className="space-y-1.5 text-center">
            <span className="font-mono text-[9.5px] font-bold tracking-widest text-primary uppercase">
              Technical Inquiries
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="border border-border/15 rounded-xl divide-y divide-border/15 overflow-hidden">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-card/5 hover:bg-card/10 transition-colors">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-[11.5px] font-bold uppercase text-foreground tracking-wide font-sans">{faq.question}</span>
                    <span className="text-muted-foreground shrink-0">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 mr-6">
                      <p className="text-[11.5px] leading-relaxed text-muted-foreground font-sans">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Separator className="bg-border/15" />

        {/* PRE-FOOTER CTA SECTION */}
        <section className="border border-primary/10 bg-primary/5 rounded-2xl p-6 md:p-8 text-center space-y-5">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Ready to claim complete content autonomy?
            </h2>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed">
              Compile, deploy, or run PostDesk inside your local environment in minutes. Free, secure, and licensed under the MIT convention.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button 
              onClick={onEnterCockpit}
              className="h-9 px-5 text-xs font-semibold uppercase bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 cursor-pointer flex items-center gap-1.5 tracking-wider transition-all"
            >
              <Terminal className="w-3.5 h-3.5" /> Start Designing Posts
            </Button>
            <a 
              href="https://github.com/bymilon/post-desk" 
              target="_blank" 
              rel="noreferrer"
            >
              <Button 
                variant="outline" 
                className="h-9 px-4 text-xs font-semibold uppercase border-border/45 hover:bg-muted/30 cursor-pointer flex items-center gap-1.5 tracking-wider font-mono text-xs"
              >
                <Github className="w-3.5 h-3.5" /> bymilon/post-desk
              </Button>
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-2 pb-8 space-y-6">
          <Separator className="bg-border/15" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-muted-foreground">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-extrabold tracking-tight text-foreground block">
                PostDesk • Content Operating System
              </span>
              <p className="text-[9.5px]">
                Built by <a href="https://x.com/milonspace" className="text-foreground hover:underline" target="_blank" rel="noreferrer">Milon Biswas</a>. Released under the MIT Specification parameters.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-[9.5px] font-mono">
              <a 
                href="https://github.com/bymilon/post-desk" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-foreground hover:underline flex items-center gap-0.5"
              >
                GitHub <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
              <a 
                href="https://x.com/milonspace" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-foreground hover:underline flex items-center gap-0.5"
              >
                Twitter/X <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
              <a 
                href="https://buymeacoffee.com/milonspace" 
                target="_blank" 
                rel="noreferrer" 
                className="text-amber-500 hover:text-amber-600 hover:underline flex items-center gap-0.5"
              >
                Sponsor Dev <Heart className="w-2.5 h-2.5 fill-current" />
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
