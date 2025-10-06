import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Users, Shield, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Motion Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Animated line wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-40 opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path
            d="M 0,100 Q 300,50 600,100 T 1200,100"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-slow"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-foreground">
                <span className="relative flex h-3 w-5 bg-accent rounded-sm">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-sm bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-5 rounded-sm bg-accent" />
                </span>
                17,000+ Domestic Workers Connected Abroad
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                Secure{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Domestic Jobs Abroad
                </span>{" "}
                with Trust & Transparency
              </h1>

              {/* Subheading */}
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">For Job Seekers:</span> Verified
                agencies, legal protection, and safe migration opportunities.
                <br />
                <span className="font-semibold text-foreground">For Employers:</span> Hire skilled,
                trusted workers with complete transparency.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" asChild className="group relative overflow-hidden bg-primary hover:bg-primary/90">
                  <Link href="/signup">
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
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

              {/* Trust Indicators */}
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
                    <div className="font-semibold text-foreground">10,000+ Workers</div>
                    <div className="text-xs text-muted-foreground">Active Community</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Global Reach</div>
                    <div className="text-xs text-muted-foreground">Across Gulf & Beyond</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                <div className="absolute inset-0 rounded-2xl border-4 border-accent/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 backdrop-blur-sm">
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <img
                      src="/worker.jpg"
                      alt="Domestic worker abroad"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-l-4 border-accent rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-accent rounded-br-xl" />
                  </div>
                </div>

                {/* Floating Stat Cards */}
                <div className="absolute -top-4 -right-4 bg-card border-2 border-accent/40 rounded-xl p-4 shadow-lg animate-float">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-xs text-muted-foreground">Placement Success</div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-card border-2 border-accent/40 rounded-xl p-4 shadow-lg animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="text-2xl font-bold text-secondary">$450</div>
                  <div className="text-xs text-muted-foreground">Avg. Salary / Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
