import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
});

export function getRequest(URL: string) {
  return axiosClient.get(`/api/${URL}`).then((response) => response);
}

export function postRequest(URL: string, payload?: object) {
  return axiosClient.post(`/api/${URL}`, payload).then((response) => response);
}

export function patchRequest(URL: string, payload?: object) {
  return axiosClient.patch(`/api/${URL}`, payload).then((response) => response);
}

export function deleteRequest(URL: string) {
  return axiosClient.delete(`/api/${URL}`).then((response) => response);
}
