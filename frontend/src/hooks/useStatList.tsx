import { useEffect, useState } from "react";
import { getStatAPI } from "../api/stat";
import { IStat } from "../components/modules/StatList/StatList";

const useStatList = (userId: string) => {
  const [statList, setStatList] = useState<IStat[]>([]);

  useEffect(() => {
    const getStatList = async () => {
      const data = await getStatAPI(userId);
      setStatList(data);
    };
    getStatList();
  }, []);
  return { statList };
};

export default useStatList;
