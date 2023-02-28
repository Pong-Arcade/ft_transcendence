import { useEffect, useState } from "react";
import { getStatAPI } from "../api/stat";
import { IStat } from "../components/modules/StatList/StatList";

const useStatList = (userId: number) => {
  const [statList, setStatList] = useState<IStat[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getStatAPI(userId);
      setStatList(data);
    })();
  }, []);
  return { statList };
};

export default useStatList;
