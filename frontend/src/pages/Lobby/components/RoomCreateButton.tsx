import React, { useRef } from "react";
import { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/ui/buttons/Button";
import ModalContainer from "../../../components/ui/modals/ModalContainer";
import CreateChatRoomModal from "../CreateChatRoomModal";
import StartGameRoomModal from "../StartGameRoomModal";
import LobbyButtonGroup from "./LobbyButtonGroup";
import LobbyFrontBoard from "./LobbyFrontBoard";

const RoomCreateButtonStyled = styled(LobbyFrontBoard)`
  height: 9%;
  align-items: center;
`;

enum ERoomCreateButtonName {
  ChatRoom = "채팅방만들기",
  NormalGame = "일반게임",
  LadderGame = "레더게임",
}

const RoomButton = styled(Button).attrs({
  fontSize: "2rem",
  width: "17vw",
  height: "6vh",
})``;

const RoomCreateButton = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [buttonType, setButtonType] = useState("");
  const roomCreateList = [
    ERoomCreateButtonName.ChatRoom,
    ERoomCreateButtonName.LadderGame,
    ERoomCreateButtonName.NormalGame,
  ];
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.textContent) return;

    setButtonType(e.currentTarget.textContent);
    setOpenModal(true);
  };

  return (
    <RoomCreateButtonStyled>
      {isOpenModal ? (
        buttonType === ERoomCreateButtonName.ChatRoom ? (
          <ModalContainer
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setOpenModal(false);
              }
            }}
          >
            <CreateChatRoomModal setOpenModal={setOpenModal}>
              {buttonType}
            </CreateChatRoomModal>
          </ModalContainer>
        ) : (
          <ModalContainer
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setOpenModal(false);
              }
            }}
          >
            <StartGameRoomModal setOpenModal={setOpenModal}>
              {buttonType}
            </StartGameRoomModal>
          </ModalContainer>
        )
      ) : null}
      <LobbyButtonGroup>
        {roomCreateList.map((elem, idx) => (
          <RoomButton key={idx} onClick={handleOnClick}>
            {elem}
          </RoomButton>
        ))}
      </LobbyButtonGroup>
    </RoomCreateButtonStyled>
  );
};

export default RoomCreateButton;
