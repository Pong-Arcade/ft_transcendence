const removeJWT = () => {
  console.log(document.cookie.length);
  document.cookie = `${
    import.meta.env.VITE_JWT_TOKEN
  }=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log(document.cookie.length);
};

export default removeJWT;
