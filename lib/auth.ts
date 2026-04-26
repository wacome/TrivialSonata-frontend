export const getUserId = () => {
  if (typeof window === 'undefined') return 'server';
  let uid = localStorage.getItem('poetry_uid');
  if (!uid) {
    // 生成一个简单的 8 位随机 ID
    uid = Math.random().toString(36).substring(2, 10);
    localStorage.setItem('poetry_uid', uid);
  }
  return uid;
};