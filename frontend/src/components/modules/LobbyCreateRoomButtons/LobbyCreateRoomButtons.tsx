import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ChooseGameModal from "../ChooseGameModal";
import CreateChatRoomModal from "../CreateChatRoomModal";

export enum ERoomCreateButtonName {
  ChatRoom = "채팅방만들기",
  NormalGame = "일반게임",
  LadderGame = "레더게임",
}

const CreateRoomButton = styled(Button).attrs({
  width: "25%",
  height: "70%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const LobbyCreateRoomButtons = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("");
  const roomCreateList = [
    ERoomCreateButtonName.ChatRoom,
    ERoomCreateButtonName.LadderGame,
    ERoomCreateButtonName.NormalGame,
  ];
  const onCreateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.textContent) return;
    setButtonTitle(e.currentTarget.textContent);
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <ButtonGroup height="10%" width="100%" boxShadow>
        {roomCreateList.map((elem, idx) => (
          <CreateRoomButton key={idx} onClick={onCreateButton}>
            {elem}
          </CreateRoomButton>
        ))}
      </ButtonGroup>
      {isOpenModal && (
        <ModalWrapper onClose={onClose}>
          {buttonTitle === ERoomCreateButtonName.ChatRoom ? (
            <CreateChatRoomModal onClose={onClose} title="채팅방만들기" />
          ) : buttonTitle === ERoomCreateButtonName.LadderGame ? (
            <ChooseGameModal onClose={onClose} buttonTitle="레더게임" />
          ) : (
            <ChooseGameModal onClose={onClose} buttonTitle="일반게임" />
          )}
        </ModalWrapper>
      )}
    </>
  );
};

export default LobbyCreateRoomButtons;
