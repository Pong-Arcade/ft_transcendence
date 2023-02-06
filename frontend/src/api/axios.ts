import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function getRequest(URL: string) {
  return axiosClient.get(`/${URL}`).then((response) => response);
}

export function postRequest(URL: string, payload: object) {
  return axiosClient.post(`/${URL}`, payload).then((response) => response);
}

export function patchRequest(URL: string, payload: object) {
  return axiosClient.patch(`/${URL}`, payload).then((response) => response);
}

export function deleteRequest(URL: string) {
  return axiosClient.patch(`/${URL}`).then((response) => response);
}
