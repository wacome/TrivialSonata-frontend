"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HomeCanvas } from "@/components/home-canvas"
import { CreateSkill } from "@/components/create-skill"
import { Profile } from "@/components/profile"
import { GestureNav } from "@/components/gesture-nav"

type ViewType = "home" | "create" | "profile"

export default function Page() {
  const [currentView, setCurrentView] = useState<ViewType>("home")

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === "home" && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen"
          >
            <HomeCanvas />
          </motion.div>
        )}

        {currentView === "create" && (
          <motion.div
            key="create"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen paper-texture"
          >
            <CreateSkill
              onPublish={() => {
                setTimeout(() => setCurrentView("home"), 2000)
              }}
            />
          </motion.div>
        )}

        {currentView === "profile" && (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen paper-texture"
          >
            <Profile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部导航 */}
      <GestureNav currentView={currentView} onNavigate={setCurrentView} />
    </main>
  )
}
