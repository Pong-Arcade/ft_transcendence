import React, { useState } from "react";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ChooseGameModal from "../ChooseGameModal";
import CreateRoomModal from "../CreateRoomModal";

export enum ERoomCreateButtonName {
  ChatRoom = "채팅방만들기",
  NormalGame = "일반게임",
  LadderGame = "레더게임",
}

const LobbyCreateRoomButtons = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [buttonType, setButtonType] = useState("");
  const roomCreateList = [
    ERoomCreateButtonName.ChatRoom,
    ERoomCreateButtonName.LadderGame,
    ERoomCreateButtonName.NormalGame,
  ];
  const handleCreateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.textContent) return;
    setButtonType(e.currentTarget.textContent);
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      {isOpenModal && (
        <ModalWrapper onClose={onClose}>
          {buttonType === ERoomCreateButtonName.ChatRoom ? (
            <CreateRoomModal onClose={onClose} buttonType={buttonType} />
          ) : (
            <ChooseGameModal onClose={onClose} buttonType={buttonType} />
          )}
        </ModalWrapper>
      )}
      <ButtonGroup height="10%" width="100%" boxShadow>
        {roomCreateList.map((elem, idx) => (
          <Button
            key={idx}
            onClick={handleCreateButton}
            width="25%"
            height="70%"
            boxShadow
            fontSize="2rem"
          >
            {elem}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
};

export default LobbyCreateRoomButtons;
