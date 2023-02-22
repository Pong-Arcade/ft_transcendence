import { useEffect, useState } from "react";
import { getRankListAPI } from "../api/ranking";
import {
  ERankingFilter,
  ERankingOrder,
} from "../components/atoms/RankingFilter/RankingFilter";
import { IRanking } from "../components/modules/Pagination/Pagination";

const useRanking = () => {
  const [filter, setFilter] = useState<ERankingFilter>(
    ERankingFilter.LADDER_SCORE
  );
  const [order, setOrder] = useState<ERankingOrder>(ERankingOrder.DESC);
  const [rankingList, setRankingList] = useState<IRanking[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getRankListAPI(filter, order);
      setRankingList(data);
    })();
  }, [filter, order]);

  return { rankingList, setFilter, setOrder };
};

export default useRanking;
