import { getRequest } from "./axios";

export const getRankListAPI = async () => {
  const response = await getRequest("stat/ranking");
  return response.data.rankList;
};
