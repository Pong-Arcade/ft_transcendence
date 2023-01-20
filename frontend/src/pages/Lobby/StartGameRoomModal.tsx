import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../../components/ui/modals/Modal";
import ButtonGroup from "../../components/ui/buttons/ButtonGroup";
import Button from "../../components/ui/buttons/Button";
import ModalTitle from "../../components/ui/modals/ModalTitle";
import CreateRoomModal from "./components/CreateRoomModal";
import CreateRoomModalContainer from "./components/CreateRoomModalContainer";
import QuickGameModal from "./QuickGameModal";

interface ICreateGameRoomModal {
  children: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const StartGameRoomModalStyled = styled(Modal)`
  width: 25%;
  height: 25%;
  justify-content: space-between;
`;

const GameRoomButtonGroup = styled(ButtonGroup)``;
const GameButton = styled(Button).attrs({
  fontSize: "2rem",
  width: "12vw",
  height: "19vh",
})``;

const StartGameRoomModal = ({
  children,
  setOpenModal,
}: ICreateGameRoomModal) => {
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openQuickStart, setOpenQuickStart] = useState(false);

  const handleCreateGameClick = () => {
    setOpenCreateGame(true);
  };
  const handleQuickStartClick = () => {
    setOpenQuickStart(true);
  };

  return (
    <>
      <StartGameRoomModalStyled>
        <ModalTitle
          title={children}
          setOpenModal={setOpenModal}
          titleFontSize={"2rem"}
        />
        <GameRoomButtonGroup>
          <GameButton onClick={handleCreateGameClick}>방만들기</GameButton>
          <GameButton onClick={handleQuickStartClick}>빠른시작</GameButton>
        </GameRoomButtonGroup>
      </StartGameRoomModalStyled>
      {openCreateGame && (
        <CreateRoomModalContainer>
          <CreateRoomModal setOpenModal={setOpenCreateGame}>
            {children}
          </CreateRoomModal>
        </CreateRoomModalContainer>
      )}
      {openQuickStart && (
        <QuickGameModal
          title={children}
          setOpenModal={setOpenQuickStart}
          titleFontSize="2rem"
        />
      )}
    </>
  );
};

export default StartGameRoomModal;
