export const removeJWT = () => {
  document.cookie = `${
    import.meta.env.VITE_JWT_TOKEN
  }=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setJWT = (token: string) => {
  document.cookie = `${import.meta.env.VITE_JWT_TOKEN}=${token}; path=/;`;
};
