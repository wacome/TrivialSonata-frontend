"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FloatingCard } from "./floating-card"
import { SkillDetail } from "./skill-detail"
import { api, SkillDTO } from "@/lib/api"

export function HomeCanvas() {
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [skills, setSkills] = useState<SkillDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSkills()
      .then(setSkills)
      .catch(console.error)
      .finally(() => setLoading(false))

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden paper-texture">
      {/* 标题区域 */}
      <motion.div
        className="absolute top-12 left-0 right-0 text-center z-10 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-3xl font-medium text-foreground tracking-wide mb-2">
          琐碎之诗
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          在这里，成功不被定义
          <br />
          只有纯粹的趣味
        </p>
      </motion.div>

      {/* 漂浮的气泡卡片画布 */}
      <motion.div
        className="absolute inset-0 pt-32"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            灵感正在汇聚...
          </div>
        ) : (
          skills.map((skill, index) => (
            <FloatingCard
              key={skill.sId}
              skill={skill}
              index={index}
              onSelect={(s) => setSelectedSkillId(s.sId)}
            />
          ))
        )}
      </motion.div>

      {/* 底部提示 */}
      <motion.div
        className="absolute bottom-32 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-xs text-muted-foreground/60">
          轻触漂浮的卡片，发现无用之美
        </p>
      </motion.div>

      {/* 装饰性元素 */}
      <div className="absolute top-1/4 left-8 w-2 h-2 rounded-full bg-accent/30 animate-shimmer" />
      <div className="absolute top-1/3 right-12 w-3 h-3 rounded-full bg-primary/20 animate-shimmer" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 left-16 w-2.5 h-2.5 rounded-full bg-accent/25 animate-shimmer" style={{ animationDelay: "2s" }} />

      {/* 技能详情弹窗 */}
      {selectedSkillId && (
        <SkillDetail 
          skillId={selectedSkillId} 
          onClose={() => setSelectedSkillId(null)} 
        />
      )}
    </div>
  )
}
