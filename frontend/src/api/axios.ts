import axios from "axios";
import { getCookie } from "../utils/cookie";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${getCookie()}`,
  },
});

axiosClient.interceptors.request.use(async (config: any) => {
  const token = getCookie();
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function getRequest(URL: string) {
  return await axiosClient.get(`/api/${URL}`).then((response) => response);
}

export async function postRequest(
  URL: string,
  payload?: object,
  options?: object
) {
  return await axiosClient
    .post(`/api/${URL}`, payload, options)
    .then((response) => response);
}

export async function patchRequest(
  URL: string,
  payload?: object,
  options?: object
) {
  return await axiosClient
    .patch(`/api/${URL}`, payload, options)
    .then((response) => response);
}

export async function deleteRequest(URL: string) {
  return await axiosClient.delete(`/api/${URL}`).then((response) => response);
}
