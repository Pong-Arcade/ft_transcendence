import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { getStatAPI } from "../api/stat";
import { IStat } from "../components/modules/StatList/StatList";
import errorState from "../state/ErrorState";

const useStatList = (userId: number) => {
  const [statList, setStatList] = useState<IStat[]>([]);
  const setError = useSetRecoilState(errorState);
  useEffect(() => {
    (async () => {
      try {
        const data = await getStatAPI(userId);
        setStatList(data);
      } catch (error) {
        setError({ isError: true, error });
      }
    })();
  }, []);
  return { statList };
};

export default useStatList;
