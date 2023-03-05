import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { getRankListAPI } from "../api/ranking";
import {
  ERankingFilter,
  ERankingOrder,
} from "../components/atoms/RankingFilter/RankingFilter";
import { IRanking } from "../components/modules/Pagination/Pagination";
import errorState from "../state/ErrorState";

const useRanking = () => {
  const [filter, setFilter] = useState<ERankingFilter>(
    ERankingFilter.LADDER_SCORE
  );
  const [order, setOrder] = useState<ERankingOrder>(ERankingOrder.DESC);
  const [rankingList, setRankingList] = useState<IRanking[]>([]);
  const setError = useSetRecoilState(errorState);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRankListAPI(filter, order);
        setRankingList(data);
      } catch (error) {
        setError({ isError: true, error });
      }
    })();
  }, [filter, order]);

  return { rankingList, setFilter, setOrder };
};

export default useRanking;
