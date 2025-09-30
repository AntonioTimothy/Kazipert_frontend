"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { FeaturesModal } from "@/components/features-modal"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Kazipert" width={40} height={40} className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">Kazipert</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/training"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Training
            </Link>
            <button
              onClick={() => setFeaturesModalOpen(true)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </button>
            <Link
              href="/videos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Videos
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Resources
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="container flex flex-col gap-4 py-4">
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/training"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Training
              </Link>
              <button
                onClick={() => {
                  setFeaturesModalOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </button>
              <Link
                href="/videos"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Videos
              </Link>
              <Link
                href="/resources"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      <FeaturesModal open={featuresModalOpen} onOpenChange={setFeaturesModalOpen} />
    </>
  )
}
