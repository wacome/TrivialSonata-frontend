"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, BookOpen, Flower2, Loader2, X, Clock, Sparkles } from "lucide-react"
import { api } from '@/lib/api';

const formatTime = (dateStr: string) => {
  const now = new Date();
  const past = new Date(dateStr);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return "今天";
  if (diffDays <= 7) return `${diffDays}天前`;
  return past.toLocaleDateString();
};

export function Profile() {
  const [activeTab, setActiveTab] = useState<"skills" | "thanks">("skills")
  const [data, setData] = useState<{ mySkills: any[], myThanks: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

  useEffect(() => {
    api.getProfile()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalThanks = data?.myThanks.length || 0;

  const getThanksCountForSkill = (skillId: number) => {
    return data?.myThanks.filter(t => t.thankNoteSkillId === skillId).length || 0;
  };

  const getSkillTitle = (skillId: number) => {
    return data?.mySkills.find(s => s.swidId === skillId)?.swidData.skillTitle || "已消失的灵感";
  };

  const bgRichness = Math.min(totalThanks / 20, 1);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!data) return <div className="p-8 text-center text-muted-foreground">陈列室暂时无法开启</div>;

  return (
    <div className="min-h-screen px-6 py-12">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 头像与背景 */}
        <div className="relative mb-8">
          <motion.div
            className="absolute inset-0 -mx-6 -mt-12 h-48 rounded-b-[3rem] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, oklch(94.324% 0.00691 88.612))`,
            }}
          >
            {Array.from({ length: Math.min(Math.floor(totalThanks / 3), 8) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${15 + i * 12}%`, top: `${20 + (i % 2) * 30}%` }}
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flower2 className="text-primary/20" style={{ width: 18 + i * 2, height: 18 + i * 2 }} />
              </motion.div>
            ))}
          </motion.div>

          <div className="relative pt-24 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-card shadow-lg flex items-center justify-center border-4 border-background">
              <span className="text-2xl font-serif text-primary">诗</span>
            </div>
            <h1 className="text-xl font-medium text-foreground mt-4">我的私人陈列室</h1>
            <p className="text-sm text-muted-foreground mt-1">收藏无意义之美</p>
          </div>
        </div>

        {/* 统计 */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="text-center">
            <p className="text-2xl font-medium text-foreground">{data.mySkills.length}</p>
            <p className="text-sm text-muted-foreground">分享的技能</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium text-foreground">{totalThanks}</p>
            <p className="text-sm text-muted-foreground">收到的感谢</p>
          </div>
        </div>

        {/* 标签切换 */}
        <div className="flex justify-center gap-4 mb-6">
          {[
            { id: "skills" as const, label: "我的技能", icon: BookOpen },
            { id: "thanks" as const, label: "感谢信", icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                  isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 内容区域 */}
        <AnimatePresence mode="wait">
          {activeTab === "skills" ? (
            <motion.div key="skills" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              {data.mySkills.length === 0 && <div className="text-center py-12 text-muted-foreground/50 text-sm">尚未发布任何技能</div>}
              {data.mySkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSkill(skill)}
                  className="p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/5 shadow-sm cursor-pointer hover:bg-card transition-colors"
                >
                  <h3 className="text-base font-medium text-foreground mb-2">{skill.swidData.skillTitle}</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart className={`w-3.5 h-3.5 ${getThanksCountForSkill(skill.swidId) > 0 ? "text-primary fill-primary/20" : ""}`} />
                    <span className="text-xs">收到 {getThanksCountForSkill(skill.swidId)} 封感谢信</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="thanks" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
              {data.myThanks.length === 0 && <div className="text-center py-12 text-muted-foreground/50 text-sm">暂未收到回响</div>}
              {data.myThanks.map((note, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">{note.thankNoteFromUser?.[0] || "缘"}</div>
                      <span className="text-xs font-medium text-foreground">{note.thankNoteFromUser || "有缘人"}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{formatTime(note.thankNoteCreatedAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 italic">"{note.thankNoteMessage || note.message}"</p>
                  <div className="inline-block px-2 py-1 rounded bg-secondary/30 text-[10px] text-muted-foreground/70">关于《{getSkillTitle(note.thankNoteSkillId)}》</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedSkill && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
              {/* 背景遮罩 */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                onClick={() => setSelectedSkill(null)}
              />
              
              {/* 弹窗主体 */}
              <motion.div 
                initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                className="relative w-full max-w-lg bg-card rounded-4xl shadow-2xl overflow-hidden p-8 paper-texture"
              >
                <button 
                  onClick={() => setSelectedSkill(null)} 
                  className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="space-y-6">
                  <header>
                    <p className="text-xs text-accent font-medium mb-2 tracking-[0.2em] uppercase">
                      {selectedSkill.swidData.skillAuthor}
                    </p>
                    <h2 className="text-2xl font-medium text-foreground leading-tight">
                      {selectedSkill.swidData.skillTitle}
                    </h2>
                  </header>

                  <div className="space-y-6">
                    {/* 如果有图片则展示 */}
                    {selectedSkill.swidData.skillImage && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden">
                        <img src={selectedSkill.swidData.skillImage} className="w-full h-full object-cover" alt="封面" />
                      </div>
                    )}

                    <p className="text-muted-foreground leading-relaxed italic">
                      “{selectedSkill.swidData.skillPreview}”
                    </p>

                    {/* 灵感详解核心块：复用 SkillDetail 的分步排版 */}
                    <div className="p-6 bg-secondary/30 rounded-[28px] space-y-5 border border-primary/5 shadow-inner">
                      <h3 className="font-medium text-card-foreground flex items-center gap-2 text-sm tracking-wide">
                        <Sparkles size={14} className="text-primary" />
                        灵感详解
                      </h3>
                      <div className="space-y-4">
                        {(selectedSkill.swidData.skillContent?.split('\n').filter((line: string) => line.trim()) || []).map((step: string, idx: number) => (
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
                        这是你分享给世界的灵感。它已在时光中留下痕迹，正在温暖着某处的一位有缘人。
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedSkill(null)}
                      className="w-full py-4 bg-primary/5 text-primary rounded-2xl font-medium hover:bg-primary/10 transition-all"
                    >
                      合上诗集
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.p className="text-center text-[10px] text-muted-foreground/40 mt-12 leading-loose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          这里没有竞争，没有喧嚣<br />只有你与世界之间，最安静的共鸣
        </motion.p>
      </motion.div>
    </div>
  )
}