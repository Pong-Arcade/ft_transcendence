import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ButtonGroup from "../ButtonGroup";
import CreateGameRoomModal from "../CreateGameRoomModal";
import ModalTitle from "../ModalTitle";
import QuickGameModal from "../QuickGameModal";

interface Props {
  title: string;
  onClose?: () => void;
}

// TODO: 리팩토링 모달 사이즈 조절
const ChooseGameButton = styled(Button).attrs({
  width: "49.5%",
  height: "100%",
  fontSize: "2rem",
})``;

const ChooseGameModal = ({ title, onClose }: Props) => {
  const { isModalOpen: isCreateGameOpen, onModalOpen: onCreateGameOpen } =
    useModal({});
  const { isModalOpen: isQuickGameOpen, onModalOpen: onQuickGameOpen } =
    useModal({});

  return (
    <>
      <Modal width="30%" height="30%">
        <ModalTitle
          onClose={onClose}
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
        >
          {title}
        </ModalTitle>
        <ButtonGroup
          height="79%"
          width="100%"
          backgroundColor="secondary"
          justifyContent="space-between"
        >
          <ChooseGameButton onClick={onCreateGameOpen}>
            방만들기
          </ChooseGameButton>
          <ChooseGameButton onClick={onQuickGameOpen}>
            빠른시작
          </ChooseGameButton>
        </ButtonGroup>
      </Modal>
      {isCreateGameOpen && (
        <CreateGameRoomModal title={title} onClose={onClose} />
      )}
      {isQuickGameOpen && <QuickGameModal onClose={onClose} title={title} />}
    </>
  );
};

export default ChooseGameModal;
