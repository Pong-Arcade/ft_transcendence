import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfoAPI } from "../api/users";
import ModalTitle from "../components/modules/ModalTitle";
import { IUser } from "../components/modules/Pagination/Pagination";
import StatList from "../components/modules/StatList";
import StatTemplate from "../components/templates/StatTemplate";
import useStatList from "../hooks/useStatList";

const Stat = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState<IUser>();
  const { statList } = useStatList(userId as string);

  if (!userId) {
    navigate("/lobby");
  }
  useEffect(() => {
    (async () => {
      if (!userId) return;
      const data = await getUserInfoAPI(+userId);
      setUserInfo(data);
    })();
  }, []);

  return (
    <StatTemplate>
      <ModalTitle
        fontSize="3rem"
        height="10%"
        onClose={() => navigate("/lobby")}
      >
        {userInfo?.nickname}님의 최근 전적
      </ModalTitle>
      <StatList list={statList.slice(0, 10)} />
    </StatTemplate>
  );
};

export default Stat;
