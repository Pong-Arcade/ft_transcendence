import React, { useState } from "react";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ButtonGroup from "../ButtonGroup";
import CreateRoomModal from "../CreateRoomModal";
import ModalTitle from "../ModalTitle";
import QuickGameModal from "../QuickGameModal";

interface Props {
  buttonType: string;
  onClose?: () => void;
}

const ChooseGameModal = ({ buttonType, onClose }: Props) => {
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openQuickStart, setOpenQuickStart] = useState(false);

  const onCreateGameClick = () => {
    setOpenCreateGame(true);
  };
  const onQuickStartClick = () => {
    setOpenQuickStart(true);
  };
  return (
    <>
      <Modal width="30%" height="30%">
        <ModalTitle
          onClose={onClose}
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
        >
          {buttonType}
        </ModalTitle>
        <ButtonGroup
          height="79%"
          width="100%"
          backgroundColor="secondary"
          justifyContent="space-between"
        >
          <Button
            width="49.5%"
            height="100%"
            fontSize="2rem"
            onClick={onCreateGameClick}
          >
            방만들기
          </Button>
          <Button
            width="49.5%"
            height="100%"
            fontSize="2rem"
            onClick={onQuickStartClick}
          >
            빠른시작
          </Button>
        </ButtonGroup>
      </Modal>
      {openCreateGame && (
        <CreateRoomModal onClose={onClose} buttonType={buttonType} />
      )}
      {openQuickStart && (
        <QuickGameModal onClose={onClose} buttonType={buttonType} />
      )}
    </>
  );
};

export default ChooseGameModal;
