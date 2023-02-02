import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ButtonGroup from "../ButtonGroup";
import CreateGameRoomModal from "../CreateGameRoomModal";
import ModalTitle from "../ModalTitle";
import QuickGameModal from "../QuickGameModal";

interface Props {
  buttonTitle: string;
  onClose?: () => void;
}

const ChooseGameButton = styled(Button).attrs({
  width: "49.5%",
  height: "100%",
  fontSize: "2rem",
})``;

const ChooseGameModal = ({ buttonTitle, onClose }: Props) => {
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openQuickStart, setOpenQuickStart] = useState(false);

  const onCreateGameClick = () => {
    setOpenCreateGame(true);
  };
  const onQuickStartClick = () => {
    setOpenQuickStart(true);
  };
  console.log(buttonTitle);
  return (
    <>
      <Modal width="30%" height="30%">
        <ModalTitle
          onClose={onClose}
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
        >
          {buttonTitle}
        </ModalTitle>
        <ButtonGroup
          height="79%"
          width="100%"
          backgroundColor="secondary"
          justifyContent="space-between"
        >
          <ChooseGameButton onClick={onCreateGameClick}>
            방만들기
          </ChooseGameButton>
          <ChooseGameButton onClick={onQuickStartClick}>
            빠른시작
          </ChooseGameButton>
        </ButtonGroup>
      </Modal>
      {openCreateGame && (
        <CreateGameRoomModal title={buttonTitle} onClose={onClose} />
      )}
      {openQuickStart && (
        <QuickGameModal onClose={onClose} title={buttonTitle} />
      )}
    </>
  );
};

export default ChooseGameModal;
