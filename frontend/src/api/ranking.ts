import { getRequest } from "./axios";

// TODO: 실패 처리
export const getRankListAPI = async () => {
  const response = await getRequest("stat/ranking");
  return response.data.rankList;
};
