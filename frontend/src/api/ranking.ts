import {
  ERankingFilter,
  ERankingOrder,
} from "../components/atoms/RankingFilter/RankingFilter";
import { getRequest } from "./axios";

export const getRankListAPI = async (
  filter: ERankingFilter,
  order: ERankingOrder
) => {
  const response = await getRequest(
    `stat/ranking/?filter=${filter}&order=${order}`
  );
  return response.data.rankList;
};
