"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, LogOut, Settings, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface PortalLayoutProps {
  children: React.ReactNode
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
  user: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}

export function PortalLayout({ children, navigation, user }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border/50 bg-gradient-to-b from-card to-card/95 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo with yellow triangle accent */}
          <div className="relative flex h-16 items-center justify-between border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 px-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-primary to-secondary" />
            {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Kazipert"
              width={60}
              height={60}
              className="h-[50px] w-auto transition-transform duration-200 group-hover:scale-105"
              priority
            />
            
          </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation with yellow triangle indicators */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Yellow triangle indicator for active item */}
                  {isActive && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 100 100" className="animate-pulse">
                        <polygon points="50,10 90,50 50,90" fill="hsl(var(--accent))" />
                      </svg>
                    </div>
                  )}
                  <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110")} />
                  <span>{item.name}</span>
                  {/* Subtle yellow triangle on hover */}
                  {!isActive && (
                    <div className="absolute right-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <svg width="8" height="8" viewBox="0 0 100 100">
                        <polygon points="50,10 90,50 50,90" fill="hsl(var(--accent))" opacity="0.5" />
                      </svg>
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User menu with enhanced design */}
          <div className="border-t border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-2 hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-accent/20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                      <svg width="8" height="8" viewBox="0 0 100 100" className="inline">
                        <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
                      </svg>
                      {user.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-sm px-6 shadow-sm">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
