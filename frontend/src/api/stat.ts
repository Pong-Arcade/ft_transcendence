import { getRequest } from "./axios";

export const getStatAPI = async (userId: string) => {
  const response = await getRequest(`stat/recent-records/${userId}`);
  return response.data.matchHistories;
};
