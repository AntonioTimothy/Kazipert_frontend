"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        {/* Animated SVG logo */}
        <div className="relative flex items-center justify-center">
          <Image
            src="/animated-logo.svg"
            alt="Kazipert Loading"
            width={120}
            height={120}
            priority
            className="animate-pulse drop-shadow-md"
          />
        </div>

        {/* Optional subtle loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-sm font-medium text-muted-foreground tracking-wide"
        >
          Loading Kazipert...
        </motion.p>
      </motion.div>
    </div>
  )
}
