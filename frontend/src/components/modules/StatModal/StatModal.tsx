import useStatList from "../../../hooks/useStatList";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ModalTitle from "../ModalTitle";
import StatList from "../StatList";

interface Props {
  userId: number;
  nickname: string;
  onClose: () => void;
}

const StatModal = ({ userId, nickname, onClose }: Props) => {
  const { statList } = useStatList(userId);

  return (
    <ModalWrapper>
      <Modal width="95%" height="95%">
        <ModalTitle fontSize="3rem" height="10%" onClose={onClose}>
          {nickname}님의 최근 전적
        </ModalTitle>
        <StatList list={statList.slice(0, 10)} />
      </Modal>
    </ModalWrapper>
  );
};

export default StatModal;
