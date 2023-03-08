export const getCookie = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${import.meta.env.VITE_JWT_TOKEN}=`)) {
      return cookie.substring(import.meta.env.VITE_JWT_TOKEN.length + 1);
    }
  }
  return null;
};

export const getDecodedCookie = () => {
  const cookie = getCookie();
  if (!cookie) throw new Error("유효한 토큰이 없습니다");

  const payload = cookie.split(".")[1];
  const decoded = window.atob(payload);
  return decoded;
};
