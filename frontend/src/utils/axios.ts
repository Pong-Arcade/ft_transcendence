import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL =
  "https://55384d9d-a692-4f97-bc90-335b8ad91fea.mock.pstmn.io";

// axios.defaults.withCredentials = true;

export function getRequest(URL: string) {
  return axiosClient.get(`/${URL}`).then((response) => {
    return response;
  });
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
