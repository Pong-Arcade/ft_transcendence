import { useNavigate, useParams } from "react-router-dom";
import ModalTitle from "../components/modules/ModalTitle";
import StatList from "../components/modules/StatList";
import StatTemplate from "../components/templates/StatTemplate";
import useStatList from "../hooks/useStatList";

// TODO: 상대 아이디 클릭시 상대 정보 모달 띄우기

const Stat = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  if (!userId) {
    navigate("/lobby");
  }

  const { statList } = useStatList(userId as string);

  return (
    <StatTemplate>
      <ModalTitle
        fontSize="3rem"
        height="10%"
        onClose={() => navigate("/lobby")}
      >
        user's 최근 전적
      </ModalTitle>
      <StatList list={statList.slice(0, 10)} />
    </StatTemplate>
  );
};

export default Stat;
