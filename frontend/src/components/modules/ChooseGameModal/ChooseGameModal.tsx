import styled from "styled-components";
import { joinQuickMatchAPI, leaveQuickMatchAPI } from "../../../api/room";
import { EGameType } from "../../../hooks/useGameRoomForm";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import CreateGameRoomModal from "../CreateGameRoomModal";
import ModalTitle from "../ModalTitle";
import QuickGameModal from "../QuickGameModal";

interface Props {
  title: string;
  onClose: () => void;
}

const ChooseGameButton = styled(Button).attrs({
  width: "49.5%",
  height: "100%",
  fontSize: "2rem",
})``;

const ChooseGameModal = ({ title, onClose }: Props) => {
  const { isModalOpen: isCreateGameOpen, onModalOpen: onCreateGameOpen } =
    useModal({});
  const { isModalOpen: isQuickMatchOpen, onModalOpen: onQuickMatchOpen } =
    useModal({
      beforeOpen: async () => {
        if (title === "레더게임") await joinQuickMatchAPI(EGameType.LADDER);
        else await joinQuickMatchAPI(EGameType.NORMAL);
      },
    });

  const leaveQuickMatch = async () => {
    await leaveQuickMatchAPI();
    onClose();
  };

  return (
    <ModalWrapper>
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
          <ChooseGameButton onClick={onQuickMatchOpen}>
            빠른시작
          </ChooseGameButton>
        </ButtonGroup>
      </Modal>
      {isCreateGameOpen && (
        <CreateGameRoomModal title={title} onClose={onClose} />
      )}
      {isQuickMatchOpen && (
        <QuickGameModal onClose={leaveQuickMatch} title={title} />
      )}
    </ModalWrapper>
  );
};

export default ChooseGameModal;
