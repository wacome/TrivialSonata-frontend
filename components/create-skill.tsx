"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImagePlus, Sparkles, ArrowRight, Check } from "lucide-react"
import { api } from "@/lib/api"

interface CreateSkillProps {
  onPublish?: (skill: {
    title: string
    joy: string
    target: string
    image?: string
  }) => void
}

export function CreateSkill({ onPublish }: CreateSkillProps) {
  const [step, setStep] = useState(0)
  const [skillTitle, setSkillTitle] = useState("")
  const [skillJoy, setSkillJoy] = useState("")
  const [skillTarget, setSkillTarget] = useState("")
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const [isPublished, setIsPublished] = useState(false)

  
  const prompts = [
    {
      prefix: "我最没用的技能是",
      suffix: "......",
      value: skillTitle,
      setValue: setSkillTitle,
      placeholder: "用落叶叠出一只小狗",
    },
    {
      prefix: "它带给我的快乐在于",
      suffix: "......",
      value: skillJoy,
      setValue: setSkillJoy,
      placeholder: "专注当下，忘记烦恼",
    },
    {
      prefix: "我想把它教给",
      suffix: "......",
      value: skillTarget,
      setValue: setSkillTarget,
      placeholder: "每一个需要片刻宁静的人",
    },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePublish = async () => {
    // 构造 content
    const fullContent = `首先，准备好${skillJoy}的心境。\n接着，面向${skillTarget}开始尝试。\n最后，在琐碎中发现诗意。`;
    const lastPost = localStorage.getItem('last_post_at');
    if (lastPost && Date.now() - parseInt(lastPost) < 60000) {
      alert("灵感需要沉淀，请一分钟后再试");
      return;
    }
    try {
      await api.createSkill({
        title: skillTitle,
        joy: skillJoy,
        target: skillTarget,
        content: fullContent,
        image: previewImage // 这里 previewImage 已经是 handleImageUpload 处理好的 Base64 字符串
      });
      localStorage.setItem('last_post_at', Date.now().toString());
      setIsPublished(true);
      
      // 如果有回调，通知父组件
      if (onPublish) {
        onPublish({
          title: skillTitle,
          joy: skillJoy,
          target: skillTarget,
          image: previewImage || undefined
        });
      }
    } catch (error) {
      console.error(error);
      alert("灵感在传输中迷失了...");
    }
  }

  const canProgress = step < prompts.length && prompts[step].value.trim()
  const canPublish = skillTitle && skillJoy && skillTarget

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 标题 */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">灵感实验室</span>
          </motion.div>
          <h1 className="text-2xl font-medium text-foreground leading-relaxed">
            分享你的无用技能
          </h1>
          <p className="text-muted-foreground mt-2">
            那些无法变现，却能点亮生活的小事
          </p>
        </div>

        {/* 填空式创作 */}
        <AnimatePresence mode="wait">
          {!isPublished ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {prompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: index <= step ? 1 : 0.3,
                    x: 0,
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={`space-y-3 ${index > step ? "pointer-events-none" : ""}`}
                >
                  <p className="text-lg text-foreground">
                    {prompt.prefix}
                    <span className="text-muted-foreground">{prompt.suffix}</span>
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={prompt.value}
                      onChange={(e) => prompt.setValue(e.target.value)}
                      placeholder={prompt.placeholder}
                      className="w-full px-0 py-3 bg-transparent border-b-2 border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors text-lg"
                      onFocus={() => setStep(index)}
                    />
                    {prompt.value && index < step && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                      >
                        <Check className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* 进度按钮 */}
              {step < prompts.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: canProgress ? 1 : 0.5 }}
                  onClick={() => canProgress && setStep(step + 1)}
                  disabled={!canProgress}
                  className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full mx-auto hover:bg-secondary/80 transition-colors disabled:cursor-not-allowed"
                >
                  继续
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}

              {/* 图片上传区域 */}
              <AnimatePresence>
                {step >= prompts.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 h-96"
                  >
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-48 bg-secondary/30 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="预览"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <ImagePlus className="w-8 h-8 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">
                              添加一张记录这份技能的照片
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              系统会自动美化排版
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* 发布按钮 */}
                    <motion.button
                      onClick={handlePublish}
                      disabled={!canPublish}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      whileTap={{ scale: 0.98 }}
                    >
                      发布到流光寻宝
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-xl font-medium text-foreground mb-2">
                已加入流光寻宝
              </h2>
              <p className="text-muted-foreground">
                你的无用技能正在等待有缘人偶遇
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
