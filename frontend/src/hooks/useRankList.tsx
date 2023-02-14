import { useEffect, useState } from "react";
import { getRankListAPI } from "../api/ranking";
import { IRanking } from "../components/modules/Pagination/Pagination";

const useRankList = () => {
  const [rankList, setRankList] = useState<IRanking[]>([]);

  useEffect(() => {
    const getRankList = async () => {
      const data = await getRankListAPI();
      setRankList(data);
    };
    getRankList();
  }, []);
  return { rankList };
};

export default useRankList;
