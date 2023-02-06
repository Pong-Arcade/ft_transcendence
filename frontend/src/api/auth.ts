export const login = () => {
  window.location.replace(`${import.meta.env.VITE_API_URL}/api/auth/login`);
};
