export const getCookie = () => {
  const cookie = document.cookie.split("=")?.[1];
  return cookie;
};

export const getDecodedCookie = () => {
  const cookie = getCookie();
  const payload = cookie.split(".")[1];
  const decoded = window.atob(payload);
  return decoded;
};
