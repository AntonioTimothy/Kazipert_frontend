import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Users, Shield, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes inspired by logo's yellow rectangle */}
        <div className="absolute top-20 left-10 h-16 w-24 bg-accent/20 rotate-12 animate-float" />
        <div
          className="absolute top-40 right-20 h-20 w-32 bg-accent/15 -rotate-6 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 h-12 w-20 bg-accent/25 rotate-45 animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Top left cluster */}
        <div className="absolute top-10 left-10 animate-float">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
          </svg>
        </div>
        <div className="absolute top-20 left-32 animate-float" style={{ animationDelay: "0.5s" }}>
          <svg width="40" height="40" viewBox="0 0 100 100" className="rotate-90">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.25" />
          </svg>
        </div>
        <div className="absolute top-40 left-20 animate-float" style={{ animationDelay: "1s" }}>
          <svg width="50" height="50" viewBox="0 0 100 100" className="rotate-180">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.2" />
          </svg>
        </div>
        <div className="absolute top-60 left-48 animate-float" style={{ animationDelay: "1.5s" }}>
          <svg width="35" height="35" viewBox="0 0 100 100" className="rotate-45">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.28" />
          </svg>
        </div>
        <div className="absolute top-80 left-16 animate-float" style={{ animationDelay: "2s" }}>
          <svg width="45" height="45" viewBox="0 0 100 100" className="rotate-[270deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.22" />
          </svg>
        </div>

        {/* Top right cluster */}
        <div className="absolute top-16 right-16 animate-float" style={{ animationDelay: "0.3s" }}>
          <svg width="70" height="70" viewBox="0 0 100 100" className="-rotate-45">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.35" />
          </svg>
        </div>
        <div className="absolute top-32 right-40 animate-float" style={{ animationDelay: "0.8s" }}>
          <svg width="45" height="45" viewBox="0 0 100 100" className="rotate-[270deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.28" />
          </svg>
        </div>
        <div className="absolute top-52 right-24 animate-float" style={{ animationDelay: "1.2s" }}>
          <svg width="55" height="55" viewBox="0 0 100 100" className="rotate-[135deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.22" />
          </svg>
        </div>
        <div className="absolute top-72 right-56 animate-float" style={{ animationDelay: "1.7s" }}>
          <svg width="38" height="38" viewBox="0 0 100 100" className="rotate-[200deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.26" />
          </svg>
        </div>
        <div className="absolute top-96 right-32 animate-float" style={{ animationDelay: "2.2s" }}>
          <svg width="42" height="42" viewBox="0 0 100 100" className="rotate-[315deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.24" />
          </svg>
        </div>

        {/* Center cluster */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: "0.6s" }}>
          <svg width="80" height="80" viewBox="0 0 100 100" className="rotate-45">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.15" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/3 animate-float" style={{ animationDelay: "1.5s" }}>
          <svg width="35" height="35" viewBox="0 0 100 100" className="rotate-[225deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
          </svg>
        </div>
        <div className="absolute top-1/4 left-1/2 translate-x-12 animate-float" style={{ animationDelay: "0.9s" }}>
          <svg width="48" height="48" viewBox="0 0 100 100" className="rotate-[120deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.27" />
          </svg>
        </div>
        <div className="absolute top-2/3 left-1/2 -translate-x-24 animate-float" style={{ animationDelay: "1.8s" }}>
          <svg width="52" height="52" viewBox="0 0 100 100" className="rotate-[180deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.23" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-2/3 animate-float" style={{ animationDelay: "2.3s" }}>
          <svg width="44" height="44" viewBox="0 0 100 100" className="rotate-[90deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.29" />
          </svg>
        </div>

        {/* Bottom left cluster */}
        <div className="absolute bottom-20 left-16 animate-float" style={{ animationDelay: "0.4s" }}>
          <svg width="65" height="65" viewBox="0 0 100 100" className="rotate-[315deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.32" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-40 animate-float" style={{ animationDelay: "0.9s" }}>
          <svg width="48" height="48" viewBox="0 0 100 100" className="rotate-[60deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.26" />
          </svg>
        </div>
        <div className="absolute bottom-60 left-24 animate-float" style={{ animationDelay: "1.3s" }}>
          <svg width="42" height="42" viewBox="0 0 100 100" className="rotate-[150deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.24" />
          </svg>
        </div>
        <div className="absolute bottom-80 left-52 animate-float" style={{ animationDelay: "1.9s" }}>
          <svg width="36" height="36" viewBox="0 0 100 100" className="rotate-[240deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.28" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-8 animate-float" style={{ animationDelay: "2.4s" }}>
          <svg width="50" height="50" viewBox="0 0 100 100" className="rotate-[30deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.25" />
          </svg>
        </div>

        {/* Bottom right cluster */}
        <div className="absolute bottom-24 right-20 animate-float" style={{ animationDelay: "0.7s" }}>
          <svg width="58" height="58" viewBox="0 0 100 100" className="rotate-[240deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.29" />
          </svg>
        </div>
        <div className="absolute bottom-48 right-36 animate-float" style={{ animationDelay: "1.1s" }}>
          <svg width="52" height="52" viewBox="0 0 100 100" className="rotate-[330deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.27" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-48 animate-float" style={{ animationDelay: "1.4s" }}>
          <svg width="38" height="38" viewBox="0 0 100 100" className="rotate-[120deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.23" />
          </svg>
        </div>
        <div className="absolute bottom-72 right-28 animate-float" style={{ animationDelay: "2.1s" }}>
          <svg width="46" height="46" viewBox="0 0 100 100" className="rotate-[210deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.26" />
          </svg>
        </div>
        <div className="absolute bottom-36 right-12 animate-float" style={{ animationDelay: "2.5s" }}>
          <svg width="40" height="40" viewBox="0 0 100 100" className="rotate-[150deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.24" />
          </svg>
        </div>

        {/* Additional scattered triangles throughout */}
        <div className="absolute top-1/4 right-1/3 animate-float" style={{ animationDelay: "1.6s" }}>
          <svg width="44" height="44" viewBox="0 0 100 100" className="rotate-[75deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.21" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: "1.8s" }}>
          <svg width="36" height="36" viewBox="0 0 100 100" className="rotate-[195deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.25" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: "2.6s" }}>
          <svg width="54" height="54" viewBox="0 0 100 100" className="rotate-[285deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.22" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float" style={{ animationDelay: "2.8s" }}>
          <svg width="42" height="42" viewBox="0 0 100 100" className="rotate-[165deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.27" />
          </svg>
        </div>
        <div className="absolute top-2/3 left-1/4 animate-float" style={{ animationDelay: "3s" }}>
          <svg width="48" height="48" viewBox="0 0 100 100" className="rotate-[255deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.24" />
          </svg>
        </div>
        <div className="absolute top-1/6 left-2/3 animate-float" style={{ animationDelay: "3.2s" }}>
          <svg width="38" height="38" viewBox="0 0 100 100" className="rotate-[345deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.26" />
          </svg>
        </div>
        <div className="absolute bottom-1/6 left-1/3 animate-float" style={{ animationDelay: "3.4s" }}>
          <svg width="46" height="46" viewBox="0 0 100 100" className="rotate-[105deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.23" />
          </svg>
        </div>
        <div className="absolute top-5/6 right-1/4 animate-float" style={{ animationDelay: "3.6s" }}>
          <svg width="40" height="40" viewBox="0 0 100 100" className="rotate-[15deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.28" />
          </svg>
        </div>

        {/* Extra dense center area triangles */}
        <div
          className="absolute top-1/2 left-1/2 translate-x-32 translate-y-16 animate-float"
          style={{ animationDelay: "3.8s" }}
        >
          <svg width="32" height="32" viewBox="0 0 100 100" className="rotate-[135deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.2" />
          </svg>
        </div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-32 -translate-y-16 animate-float"
          style={{ animationDelay: "4s" }}
        >
          <svg width="34" height="34" viewBox="0 0 100 100" className="rotate-[225deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.21" />
          </svg>
        </div>
        <div
          className="absolute top-1/2 left-1/2 translate-x-48 -translate-y-24 animate-float"
          style={{ animationDelay: "4.2s" }}
        >
          <svg width="36" height="36" viewBox="0 0 100 100" className="rotate-[315deg]">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.22" />
          </svg>
        </div>

        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Animated connecting lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path
            d="M 0,300 Q 400,200 800,300 T 1600,300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-slow"
          />
          <path
            d="M 0,400 Q 400,500 800,400 T 1600,400"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge with yellow rectangle accent */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-foreground">
                <span className="relative flex h-3 w-5 bg-accent rounded-sm">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-sm bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-5 rounded-sm bg-accent" />
                </span>
                17,000+ Kenyans Connected to Gulf Opportunities
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                Your Trusted Digital Marketplace for{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Jobs Abroad
                  </span>
                  {/* Yellow rectangle underline */}
                  <span className="absolute -bottom-2 left-0 h-1.5 w-full bg-accent rounded-full" />
                </span>
              </h1>

              {/* Subheading for both audiences */}
              <p className="mb-8 text-lg text-muted-foreground text-pretty leading-relaxed">
                <span className="font-semibold text-foreground">For Job Seekers:</span> Access verified employers, legal
                protection, and fair contracts.
                <br />
                <span className="font-semibold text-foreground">For Employers:</span> Find qualified, verified workers
                with complete transparency.
              </p>

              {/* CTA Buttons with yellow accents */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" asChild className="group relative overflow-hidden bg-primary hover:bg-primary/90">
                  <Link href="/signup">
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    {/* Yellow accent on hover */}
                    <span className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="group border-2 border-accent/30 hover:bg-accent/10 bg-transparent"
                >
                  <Link href="/videos">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Training Videos
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators with yellow accents */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">KYC Verified</div>
                    <div className="text-xs text-muted-foreground">100% Secure</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">10,000+ Users</div>
                    <div className="text-xs text-muted-foreground">Active Community</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">24/7 Support</div>
                    <div className="text-xs text-muted-foreground">Always Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                {/* Central image with yellow frame */}
                <div className="absolute inset-0 rounded-2xl border-4 border-accent/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 backdrop-blur-sm">
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <img
                      src="/african-woman-professional.jpg"
                      alt="Professional worker"
                      className="h-full w-full object-cover"
                    />
                    {/* Yellow corner accents */}
                    <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-l-4 border-accent rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-accent rounded-br-xl" />
                  </div>
                </div>

                {/* Floating stat cards with yellow accents */}
                <div className="absolute -top-4 -right-4 bg-card border-2 border-accent/40 rounded-xl p-4 shadow-lg animate-float">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-card border-2 border-accent/40 rounded-xl p-4 shadow-lg animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="text-2xl font-bold text-secondary">$450</div>
                  <div className="text-xs text-muted-foreground">Avg. Salary</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
