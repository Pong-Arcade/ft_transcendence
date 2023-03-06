import { deleteRequest, patchRequest } from "./axios";

export const loginAPI = () => {
  window.location.replace(`${import.meta.env.VITE_API_URL}/api/auth/login`);
};

export const enroll2FAAPI = async () => {
  const response = patchRequest("auth/enroll/2FA");
  return response;
};

export const verify2FAAPI = async (access: string) => {
  const response = patchRequest(`auth/verify/2FA/${access}`);
  return response;
};

export const logoutAPI = async () => {
  const response = deleteRequest("auth/logout");
  return response;
};
