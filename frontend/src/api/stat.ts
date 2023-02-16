import { getRequest } from "./axios";

// TODO: 실패 처리
export const getStatAPI = async (userId: string) => {
  const response = await getRequest(`stat/recent-records/${userId}`);
  return response.data.matchHistories;
};
