"use client"

import { useEffect, useState } from "react"

export function LoadingSpinner() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 120) % 360)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="relative">
        {/* Animated yellow triangles */}
        <div className="relative h-32 w-32">
          {[0, 120, 240].map((offset, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-transform duration-400 ease-in-out"
              style={{
                transform: `rotate(${rotation + offset}deg)`,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                }}
              >
                <polygon
                  points="50,10 90,90 10,90"
                  fill="hsl(var(--accent))"
                  opacity={0.8 - index * 0.2}
                  className="animate-pulse"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg">
            <span className="text-2xl font-bold text-primary">K</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-foreground">Loading Kazipert</p>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    </div>
  )
}
