"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, User, Home } from "lucide-react"

interface GestureNavProps {
  currentView: "home" | "create" | "profile"
  onNavigate: (view: "home" | "create" | "profile") => void
}

export function GestureNav({ currentView, onNavigate }: GestureNavProps) {
  const navItems = [
    { id: "home" as const, icon: Home, label: "流光寻宝" },
    { id: "create" as const, icon: Plus, label: "灵感实验室" },
    { id: "profile" as const, icon: User, label: "私人陈列室" },
  ]

  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", damping: 20 }}
    >
      <div className="flex items-center gap-2 px-2 py-2 bg-card/70 glass rounded-full shadow-lg shadow-foreground/5">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const Icon = item.icon
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative px-4 py-3 rounded-full transition-colors"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative z-10 flex items-center gap-2">
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`} 
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium text-primary overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
