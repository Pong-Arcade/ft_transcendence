import {
  ERankingFilter,
  ERankingOrder,
} from "../components/atoms/RankingFilter/RankingFilter";
import { getRequest } from "./axios";

// TODO: 실패 처리
export const getRankListAPI = async (
  filter: ERankingFilter,
  order: ERankingOrder
) => {
  const response = await getRequest(
    `stat/ranking/?filter=${filter}&order=${order}`
  );
  return response.data.rankList;
};
