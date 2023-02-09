import { getRequest } from "./axios";

export const loginAPI = () => {
  window.location.replace(`${import.meta.env.VITE_API_URL}/api/auth/login`);
};

export const logoutAPI = () => {
  return getRequest("api/auth/logout");
};
