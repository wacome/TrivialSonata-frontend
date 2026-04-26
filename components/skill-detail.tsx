"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Heart, Clock, Sparkles, Loader2 } from "lucide-react"
import { api, FullSkill } from "@/lib/api"

interface SkillDetailProps {
  skillId: number | null
  onClose: () => void
}

export function SkillDetail({ skillId, onClose }: SkillDetailProps) {
  const [skill, setSkill] = useState<FullSkill | null>(null)
  const [loading, setLoading] = useState(true)
  const [knockStep, setKnockStep] = useState<"idle" | "mood" | "sent" | "unlocked">("idle")
  const [moodText, setMoodText] = useState("")
  const [showThankYou, setShowThankYou] = useState(false)

  // 1. 加载详情
  useEffect(() => {
    if (skillId) {
      setLoading(true)
      api.getSkillDetail(skillId)
        .then(setSkill)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [skillId])

  if (!skillId) return null

  // 2. 处理叩门
  const handleSendKnock = async () => {
    if (!moodText.trim()) return
    try {
      await api.knock(skillId, moodText)
      setKnockStep("sent")
      // 后端逻辑是即时 unlock ( status: "unlocked" )，这里模拟一个加载感
      setTimeout(() => setKnockStep("unlocked"), 1200)
    } catch (e) {
      alert("回响未能传达...")
    }
  }

  // 3. 处理感谢
  const handleSendThanks = async () => {
    try {
      await api.sendThank(skillId, "谢谢你的灵感分享。")
      setShowThankYou(true)
      setTimeout(() => setShowThankYou(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          className="relative w-full max-w-lg bg-card rounded-4xl shadow-2xl overflow-hidden p-8 paper-texture"
        >
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-6">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>

              <header>
                <p className="text-xs text-accent font-medium mb-2 tracking-[0.2em] uppercase">{skill?.skillAuthor}</p>
                <h2 className="text-2xl font-medium text-foreground leading-tight">{skill?.skillTitle}</h2>
              </header>

              <AnimatePresence mode="wait">
                {knockStep !== "unlocked" ? (
                  <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    {skill?.skillImage && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                        <img 
                          src={skill.skillImage} 
                          alt="记录" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <p className="text-muted-foreground leading-relaxed italic">“{skill?.skillPreview}”</p>
                    
                    {knockStep === "idle" && (
                      <button onClick={() => setKnockStep("mood")} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:opacity-90 transition-all">叩门请求</button>
                    )}

                    {knockStep === "mood" && (
                      <div className="space-y-4">
                        <textarea 
                          autoFocus
                          value={moodText}
                          onChange={(e) => setMoodText(e.target.value)}
                          placeholder="传达你的诚意或此刻的心情..."
                          className="w-full h-32 p-4 rounded-2xl bg-muted/50 border-none focus:ring-1 focus:ring-primary resize-none transition-all placeholder:text-muted-foreground/50 text-sm"
                        />
                        <button onClick={handleSendKnock} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2"><Send size={16}/> 发送回响</button>
                      </div>
                    )}
                    
                    {knockStep === "sent" && (
                      <div className="text-center py-10 space-y-3">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary/40" />
                        <p className="text-sm text-muted-foreground animate-pulse font-serif">正在等待风的回传...</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="unlocked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* 技能详解核心块 */}
                    <div className="p-6 bg-secondary/30 rounded-[28px] space-y-5 border border-primary/5 shadow-inner">
                      <h3 className="font-medium text-card-foreground flex items-center gap-2 text-sm tracking-wide">
                        <Sparkles size={14} className="text-primary" />
                        灵感详解
                      </h3>
                      <div className="space-y-4">
                        {/* 解析换行符为步骤 */}
                        {(skill?.skillContent?.split('\n').filter(line => line.trim()) || []).map((step, idx) => (
                          <div key={idx} className="flex gap-4 group">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-2xl border border-dashed border-muted-foreground/20">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-[11px] text-muted-foreground/80 leading-tight">
                        这是一项需要慢慢品味的技能。灵感已收藏至你的“私人陈列室”，24小时后可重复翻阅。
                      </p>
                    </div>

                    <button onClick={handleSendThanks} className="w-full py-4 border border-primary/20 text-primary rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
                      <Heart size={18} className={showThankYou ? "fill-primary" : ""} /> 
                      投递感谢信
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 感谢反馈遮罩 */}
          <AnimatePresence>
            {showThankYou && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary flex flex-col items-center justify-center text-primary-foreground z-10">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Heart size={48} fill="currentColor" /></motion.div>
                <p className="mt-4 font-medium">感谢信已寄出</p>
                <p className="text-xs opacity-70">你的温暖已抵达对方的陈列室</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}