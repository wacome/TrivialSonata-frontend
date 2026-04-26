"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SkillData {
  sId: number
  sTitle: string
  sPreview: string
  sAuthor: string
  mood?: string
}

interface FloatingCardProps {
  skill: SkillData
  index: number
  onSelect: (skill: SkillData) => void
}

export function FloatingCard({ skill, index, onSelect }: FloatingCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pressTimer = useRef<NodeJS.Timeout | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      setShowPreview(true)
      // 模拟震动反馈
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 300)
    setIsPressed(true)
  }

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
    }
    setIsPressed(false)
    if (showPreview) {
      onSelect(skill)
    }
    setShowPreview(false)
  }

  // 根据索引生成随机位置和动画延迟
  const randomOffset = {
    x: ((index * 137) % 60) - 30,
    y: ((index * 89) % 40) - 20,
    rotation: ((index * 23) % 6) - 3,
    delay: (index * 0.3) % 2,
    duration: 6 + (index % 4),
  }

  return (
    <>
      <motion.div
        className="absolute cursor-pointer select-none"
        style={{
          left: `${15 + ((index * 17) % 70)}%`,
          top: `${10 + ((index * 23) % 75)}%`,
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: isPressed ? 1.05 : 1,
          y: [0, -12, -6, -18, 0],
          x: [0, randomOffset.x * 0.3, -randomOffset.x * 0.2, randomOffset.x * 0.1, 0],
          rotate: [0, randomOffset.rotation, -randomOffset.rotation * 0.5, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: randomOffset.delay * 0.5 },
          scale: { duration: 0.2 },
          y: {
            duration: randomOffset.duration,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: {
            duration: randomOffset.duration * 1.3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: randomOffset.duration * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          handlePressEnd()
        }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <div
          className={`
            relative px-6 py-4 rounded-2xl
            bg-card/80 glass
            shadow-lg shadow-primary/5
            transition-all duration-300
            ${isHovered ? "shadow-xl shadow-primary/10" : ""}
            ${isPressed ? "ring-2 ring-primary/20" : ""}
          `}
        >
          {/* 装饰性光晕 */}
          <div className="absolute -inset-1 bg-linear-to-br from-accent/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* 卡片内容 */}
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground mb-1 tracking-wide">
              {skill.sAuthor}
            </p>
            <h3 className="text-base font-medium text-card-foreground leading-relaxed max-w-50">
              {skill.sTitle}
            </h3>
          </div>

          {/* 悬浮提示 */}
          <AnimatePresence>
            {isHovered && !showPreview && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs text-muted-foreground">
                  长按探索
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 长按预览弹窗 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handlePressEnd}
          >
            <motion.div
              className="bg-card p-8 rounded-3xl shadow-2xl max-w-md mx-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <p className="text-sm text-muted-foreground mb-3">
                {skill.sAuthor}
              </p>
              <h2 className="text-xl font-medium text-card-foreground mb-4 leading-relaxed">
                {skill.sTitle}
              </h2>
              <p className="text-muted-foreground leading-loose mb-6">
                {skill.sPreview}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(skill)
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  叩门请求
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
