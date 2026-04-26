const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090/api';
import { getUserId } from './auth';

const handleResponse = async (res: Response) => {
  if (res.status === 429) throw new Error("你的灵感太快，风追不上你（请一分钟后再试）");
  if (res.status === 413) throw new Error("灵感过于沉重（超出 5MB 限制）");
  if (!res.ok) throw new Error("同步灵感失败");
  // 处理 Post NoContent 的情况
  if (res.status === 204) return null;
  return res.json();
};

// 对应后端的 SkillDTO
export interface SkillDTO {
  sId: number;
  sTitle: string;
  sPreview: string;
  sAuthor: string;
}

// 对应后端的 Skill 实体（Persistent 默认转换格式）
export interface FullSkill {
  skillTitle: string;
  skillJoy: string;
  skillTarget: string;
  skillPreview: string;
  skillAuthor: string;
  skillContent: string; // 后端存储的完整步骤文本
  skillImage: string;
  skillCreatedAt: string;
}

export const api = {
  getSkills: () => 
    fetch(`${BASE_URL}/skills`).then(res => res.json()),

  getSkillDetail: (id: number): Promise<FullSkill> => 
    fetch(`${BASE_URL}/skills/${id}`).then(res => res.json()),

  createSkill: (data: { title: string; joy: string; target: string; content: string; image?: string }) => 
    fetch(`${BASE_URL}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reqTitle: data.title,
        reqJoy: data.joy,
        reqTarget: data.target,
        reqContent: data.content,
        reqUid: getUserId(),
        reqImage: data.image
      }),
    }).then(handleResponse),

  knock: (id: number, message: string) =>
    fetch(`${BASE_URL}/skills/${id}/knock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kVisitor: "匿名诗人", kMessage: message }),
    }).then(res => res.text()),

  getProfile: () => fetch(`${BASE_URL}/profile/${getUserId()}`).then(handleResponse),

  sendThank: (skillId: number, message: string) =>
    fetch(`${BASE_URL}/skills/${skillId}/thank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    }).then(handleResponse)
};